import Taro, { CanvasContext } from "@tarojs/taro";
import pLimit from "p-limit";
import {
  FreePosterOptions,
  PaintImage,
  PaintShape,
  PaintText,
  PosterItemConfig,
} from "./types";

import { isAlipay, toPx, toRpx } from "./utils";
export default class FreePoster {
  private ctx: CanvasContext;
  private downloadLimit: ReturnType<typeof pLimit>;
  private images: Map<string, Taro.getImageInfo.SuccessCallbackResult> = new Map();
  private options: FreePosterOptions = {
    canvasId: "posterCanvasId",
    debug: true,
    width: 500,
    height: 400,
    fileType: "png",
    quality: 1,
    downloadLimit: 10,
  };

  constructor(options: Partial<FreePosterOptions>) {
    this.options = Object.assign(this.options, options);
    this.downloadLimit = pLimit(this.options.downloadLimit || 10);
    this.ctx = Taro.createCanvasContext(this.options.canvasId, this);
  }

  /**
   * canvas绘制背景色
   */
  public async setCanvasBackground(canvasBackground) {
    if (canvasBackground) {
      this.time("渲染背景色");
      const { width, height } = this.options;
      this.log("设置canvas的背景色=>", canvasBackground);
      // this.ctx.save();
      this.ctx.setFillStyle(canvasBackground);
      this.ctx.fillRect(0, 0, width, height);
      await this.draw(true);
      this.ctx.restore();
      this.timeEnd("渲染背景色");
    }
  }
  /**
   * 下载图片
   * @param src
   * @private
   */
  private loadImage = async (url: string): Promise<string | undefined> => {
    let retryCounter = 0;
    if (!url) {
      this.log("图像路径不能为空");
      return Promise.resolve(undefined);
    }
    if (this.images.has(url)) {
      return Promise.resolve(this.images.get(url)?.path);
    }
    // 支持微信本地临时文件
    if (url.startsWith("wxfile://")) {
      try {
        Taro.getFileSystemManager().accessSync(url);
        const newUrl = await Taro.getImageInfo({ src: url })
        this.images.set(url, newUrl);
        return Promise.resolve(url);
      } catch (e) {
        this.log(e);
        this.log(`本地临时文件不存在`, url);
        return undefined;
      }
    }
    const downloadFile = async (resolve) => {
      try {
        this.time(`下载图片${url}用时`);
        const res = await Taro.getImageInfo({ src: url });
        retryCounter = 0;
        resolve(res.path);
        this.images.set(url, res);
        this.timeEnd(`下载图片${url}用时`);
      } catch (e) {
        if (++retryCounter <= 2) {
          this.log(`图片下载失败, 开始第${retryCounter}次重试`, url);
          await downloadFile(resolve);
        } else {
          this.log("三次尝试图片仍下载失败,放弃治疗", url, e);
          resolve(undefined);
          this.images.delete(url);
        }
      }
    };
    return new Promise(async (resolve) => {
      await downloadFile(resolve);
    });
  };

  /**
   * 绘制图片
   * @param options
   */
  public async paintImage(options: Omit<PaintImage, "type">) {
    this.time("绘制图片时间");
    this.log("开始绘制图片", options);
    const {
      x,
      y,
      width,
      height,
      radius = 2,
      src,
      backgroundColor,
      defaultSrc,
    } = options;
    const [r1, r2, r3, r4] =
      typeof radius === "string"
        ? radius.split(" ").map((item) => Number(item))
        : new Array<number>(4).fill(radius);
    let newSrc = await this.loadImage(src);
    if (!newSrc && defaultSrc) {
      newSrc = await this.loadImage(defaultSrc);
    }
    if (newSrc) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(toPx(x + r1), toPx(y));
      this.ctx.arcTo(
        toPx(x + width),
        toPx(y),
        toPx(x + width),
        toPx(y + height),
        // 圆角小于2的话安卓会出问题
        toPx(Math.max(r2, 2))
      );
      this.ctx.arcTo(
        toPx(x + width),
        toPx(y + height),
        toPx(x),
        toPx(y + height),
        toPx(Math.max(r3, 2))
      );
      this.ctx.arcTo(
        toPx(x),
        toPx(y + height),
        toPx(x),
        toPx(y),
        toPx(Math.max(r4, 2))
      );
      this.ctx.arcTo(
        toPx(x),
        toPx(y),
        toPx(x + width),
        toPx(y),
        toPx(Math.max(r1, 2))
      );
      this.ctx.closePath();
      this.ctx.clip();
      if (backgroundColor) {
        this.ctx.setFillStyle(backgroundColor);
        this.ctx.fill();
      }
      this.fitImage(options);
      await this.draw(true);
      this.ctx.restore();
      this.timeEnd("绘制图片时间");
    } else {
      console.error(`图片${options.src}下载失败，跳过渲染`);
    }
  }

  /**
   * 图片处理
   * @see https://www.cnblogs.com/AIonTheRoad/p/14063041.html
   * @param options
   */
  private fitImage(options: Omit<PaintImage, "type">) {
    const image =
      this.images.get(options.src) || this.images.get(options.defaultSrc!);
    if (!image) {
      this.log("处理图片失败，图片不存在");
      return;
    }

    const mode = options.mode || "fill";
    // 图片宽高比
    const imageRatio = image.width / image.height;
    // 绘制区域宽高比
    const rectRatio = options.width / options.height;
    let sw: number,
      sh: number,
      sx: number,
      sy: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number;

    if (mode === "contain") {
      if (imageRatio <= rectRatio) {
        dh = options.height;
        dw = dh * imageRatio;
        dx = options.x + (options.width - dw) / 2;
        dy = options.y;
      } else {
        dw = options.width;
        dh = dw / imageRatio;
        dx = options.x;
        dy = options.y + (options.height - dh) / 2;
      }
      this.ctx.drawImage(image.path, toPx(dx), toPx(dy), toPx(dw), toPx(dh));
    } else if (mode === "cover") {
      if (imageRatio <= rectRatio) {
        sw = image.width;
        sh = sw / rectRatio;
        sx = 0;
        sy = (image.height - sh) / 2;
      } else {
        sh = image.height;
        sw = sh * rectRatio;
        sx = (image.width - sw) / 2;
        sy = 0;
      }
      this.ctx.drawImage(
        image.path,
        options.sx ?? sx,
        options.sy ?? sy,
        sw,
        sh,
        toPx(options.x),
        toPx(options.y),
        toPx(options.width),
        toPx(options.height)
      );
    } else {
      this.ctx.drawImage(
        image.path,
        toPx(options.x),
        toPx(options.y),
        toPx(options.width),
        toPx(options.height)
      );
    }
  }

  /**
   * 绘制shape
   * @param options
   */
  public async paintShape(options: Omit<PaintShape, "type">) {
    this.time("绘制图形时间");
    this.log("开始绘制图形", options);
    const {
      x,
      y,
      width,
      height,
      radius = 2,
      fillStyle,
      lineWidth,
      strokeStyle,
      gradient
    } = options;
    const [r1, r2, r3, r4] =
      typeof radius === "string"
        ? radius.split(" ").map((item) => Number(item))
        : new Array<number>(4).fill(radius);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(toPx(x + r1), toPx(y));

    this.ctx.arcTo(
      toPx(x + width),
      toPx(y),
      toPx(x + width),
      toPx(y + height),
      toPx(Math.max(r2, 2))
    );

    this.ctx.arcTo(
      toPx(x + width),
      toPx(y + height),
      toPx(x),
      toPx(y + height),
      toPx(Math.max(r3, 2))
    );
    this.ctx.arcTo(
      toPx(x),
      toPx(y + height),
      toPx(x),
      toPx(y),
      toPx(Math.max(r4, 2))
    );
    this.ctx.arcTo(
      toPx(x),
      toPx(y),
      toPx(x + width),
      toPx(y),
      toPx(Math.max(r1, 2))
    );
    this.ctx.closePath();
    this.ctx.clip();
    if (gradient && !fillStyle) {
      //渐变色
      const [x1, y1, x2, y2] = gradient.position
      const grd = this.ctx.createLinearGradient(x1, y1, x2, y2)
      grd.addColorStop(0, gradient.colors[0])
      grd.addColorStop(1, gradient.colors[1])
      // Fill with gradient
      this.ctx.setFillStyle(grd)
      this.ctx.fill();
    }
    if (fillStyle && !gradient) {
      this.ctx.setFillStyle(fillStyle);
      this.ctx.fill();
    }
    if (lineWidth && strokeStyle) {
      this.ctx.setStrokeStyle(strokeStyle);
      this.ctx.lineWidth = toPx(lineWidth);
      this.ctx.stroke();
    }

    await this.draw(true);
    this.ctx.restore();
    this.timeEnd("绘制图形时间");
  }

  /**
   * 绘制文字
   * @param options
   */
  public async paintText(options: Omit<PaintText, "type">) {
    this.time("绘制文字时间");
    this.log("开始绘制文字", options);
    let {
      textAlign = "left",
      opacity = 1,
      lineNum = 1,
      lineHeight = 0,
      fontWeight = "normal",
      fontStyle = "normal",
      fontFamily = "sans-serif",
      textDecoration,
      fontSize
    } = options;
    lineHeight = Math.max(lineHeight || fontSize)
    this.ctx.save();
    this.ctx.font =
      fontStyle +
      " " +
      fontWeight +
      " " +
      toPx(fontSize) +
      "px " +
      fontFamily;
    this.ctx.setGlobalAlpha(opacity);
    this.ctx.setFillStyle(options.color);
    this.ctx.setTextBaseline(options.baseLine);
    this.ctx.setTextAlign(textAlign);

    let textWidth: number = this.measureTextWidth(options.text, {
      fontSize: options.fontSize,
      fontFamily,
      fontStyle,
      fontWeight,
    });
    const width =
      typeof options.width === "number"
        ? options.width
        : options.width(textWidth, this);
    const x =
      typeof options.x === "number" ? options.x : options.x(textWidth, this);

    const textArr: string[] = [];
    if (textWidth > width) {
      // 文本宽度 大于 渲染宽度
      let fillText = "";
      let line = 1;
      for (let i = 0; i <= options.text.length - 1; i++) {
        // 将文字转为数组，一行文字一个元素
        fillText = fillText + options.text[i];
        if (
          this.measureTextWidth(fillText, {
            fontSize: options.fontSize,
            fontFamily,
            fontStyle,
            fontWeight,
          }) >= width
        ) {
          if (line === lineNum) {
            if (i !== options.text.length - 1) {
              fillText = fillText.substring(0, fillText.length - 1) + "...";
            }
          }
          if (line <= lineNum) {
            textArr.push(fillText);
          }
          fillText = "";
          line++;
        } else {
          if (line <= lineNum) {
            if (i === options.text.length - 1) {
              textArr.push(fillText);
            }
          }
        }
      }
      textWidth = width;
    } else {
      textArr.push(options.text);
    }
    textArr.forEach((item, index) => {
      const gap = (lineHeight - fontSize) / 2
      const line1 = gap + fontSize
      this.ctx.fillText(
        item,
        toPx(x),
        toPx(options.y + line1 * (index + 1) + gap * index)
      );
    });
    if (textDecoration === 'line-through' && lineNum === 1) {
      this.ctx.setStrokeStyle(options.color)
      this.ctx.setLineWidth(1)
      const y = options.y + lineHeight / 2 + 2
      this.ctx.moveTo(toPx(x), toPx(y))
      //先将笔滑到200,200处
      this.ctx.lineTo(toPx(x + textWidth), toPx(y));
      //执行绘画的动作，如果没有执行stroke函数不会有任何的效果
      this.ctx.stroke();
    }

    await this.draw(true);
    this.ctx.restore();
    this.timeEnd("绘制文字时间");
    return textWidth;
  }

  /**
   * 清楚画布
   */
  public async clearRect() {
    this.ctx.clearRect(
      0,
      0,
      toPx(this.options.width),
      toPx(this.options.height)
    );
    await this.draw();
  }

  /**
   * 计算文本宽度
   * @param text
   */
  public measureTextWidth(
    text: string,
    options?: {
      fontSize: number;
      fontWeight?: string;
      fontStyle?: string;
      fontFamily?: string;
    }
  ) {
    this.ctx.save();

    if (options) {
      const {
        fontStyle = "normal",
        fontFamily = "normal",
        fontWeight = "normal",
        fontSize,
      } = options;
      this.ctx.font =
        fontStyle +
        " " +
        fontWeight +
        " " +
        toPx(fontSize) +
        "px " +
        fontFamily;
    }
    // measureText返回的是px
    const textWidth = toRpx(this.ctx.measureText(text).width);
    this.ctx.restore();
    return textWidth;
  }

  private async draw(reserve?: boolean) {
    return new Promise((resolve) => {
      this.ctx.draw(reserve, (res) => resolve(res));
    });
  }
  /**
   * 生成临时文件
   */
  public canvasToTempFilePath(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this.log("开始截取canvas图片");
        this.time("截取canvas图片时间");

        Taro.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            quality: this.options.quality,
            fileType: this.options.fileType,
            canvasId: this.options.canvasId,
            success: (res) => {
              const localUrl = isAlipay
                ? (res as any).apFilePath
                : res.tempFilePath;
              this.log("截取canvas图片成功", localUrl);
              this.timeEnd("截取canvas图片时间");
              resolve(localUrl);
            },
            fail: (err) => {
              this.log("截取canvas目前的图像失败", err);
              reject(err);
            },
          },
          this
        );
      }, 50);
    });
  }

  /**
   * 提前下载图片
   * @param images
   * @returns boolean 有一张图下载失败都会返回false,但不会阻塞后续图片下载
   */
  public async preloadImage(images: string[]): Promise<boolean> {
    this.log("开始提前下载图片");
    this.time("提前下载图片用时");
    const needLoadImages = Array.from(
      new Set(images.filter((item) => !this.images.has(item)))
    );
    const loadedImages = await Promise.all(
      needLoadImages.map((item) =>
        this.downloadLimit(() => this.loadImage(item))
      )
    );
    this.timeEnd("提前下载图片用时");
    return !loadedImages.includes(undefined);
  }

  /**
   * 保存到相册
   */
  public async savePosterToPhoto(): Promise<string> {
    this.log("开始保存到相册");
    Taro.showLoading({title:"保存中..."})
    return new Promise(async (resolve, reject) => {
      try {
        const tmp = await this.canvasToTempFilePath();
        Taro.saveImageToPhotosAlbum({
          filePath: tmp,
          success: () => {
            this.log("保存到相册成功");
            this.options?.onSave?.(tmp);
            Taro.showToast({
              title: "保存成功",
            });
            resolve(tmp);
          },
          fail: (err) => {
            if (err.errMsg !== "saveImageToPhotosAlbum:fail cancel") {
              this.getAuth();
            }
            this.log("保存到相册失败");
            reject(err);
            this.options?.onSaveFail?.(err);
          },
        });
      } catch (e) {
        this.options?.onSaveFail?.(e);
        this.log("保存到相册失败");
      }
    });
  }

  public log = (message?: any, ...optionalParams: any[]) => {
    if (this.options.debug) {
      console.log(message, ...optionalParams);
    }
  };

  public time = (message: string) => {
    if (this.options.debug) {
      console.time(message);
    }
  };

  public timeEnd = (message: string) => {
    if (this.options.debug) {
      console.timeEnd(message);
    }
  };

  /**
   * 获取授权
   */
  private getAuth() {
    Taro.hideLoading();
    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
    Taro.showModal({
      content: "需要您授权保存相册",
      confirmColor: "#FB5629",
      showCancel: false,
      success: ({ confirm }) => {
        confirm &&
          Taro.openSetting({
            success(settingdata) {
              console.log("settingdata", settingdata);
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                Taro.showToast({
                  title: "获取权限成功,再操作一次",
                  icon: "none",
                });
              } else {
                Taro.showToast({
                  title: "获取权限失败，将无法保存到相册",
                  icon: "none",
                });
              }
            },
            fail(failData) {
              console.log("failData", failData);
            },
            complete(finishData) {
              console.log("finishData", finishData);
            },
          });
      },
    });
  }

  public exec = (options: PosterItemConfig) => {
    const funcMap = {
      image: "paintImage",
      shape: "paintShape",
      text: "paintText",
    };
    if (!funcMap[options.type]) {
      throw new Error(`[taro-poster-render]: ${options.type}类型不存在`);
    }
    return this[funcMap[options.type]](options);
  };
}