import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import PropTypes from "prop-types";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.less";

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string,
  };
  constructor(props) {
    super(props);
    const html = this.props.detail ? this.props.detail : `<div></div>`;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  //获取转成html标签后的输入内容
  getDetail = () => {
    //返回输入数据对应的html格式的文本
    const { editorState } = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };
  //当编辑内容改变时触发的回调函数
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  //编辑器上传图片回调
  uploadImageCallBack2 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const img = new Image();
      // let url = ''
      reader.onload = function (e) {
        img.src = this.result;
      };

      img.onload = function () {
        // console.log(img); // 获取图片
        // console.log(img.src.length)
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // 图片原始尺寸
        const originWidth = this.width;
        const originHeight = this.height;

        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        const maxWidth = 400;
        const maxHeight = 500;
        // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        // 图片尺寸超过300x300的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /* 第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高 */

        // 压缩后的图片转base64 url
        /* canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
         * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92 */
        const newUrl = canvas.toDataURL("image/jpeg", 0.92); // base64 格式
        resolve({
          data: {
            link: newUrl,
          },
        });

        // 也可以把压缩后的图片转blob格式用于上传
        // canvas.toBlob((blob)=>{
        //     console.log(blob)
        //     //把blob作为参数传给后端
        // }, 'image/jpeg', 0.92)
      };
    });
  };
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/manage/img/upload");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        const url = response.data.url; //得到图片的url
        resolve({ data: { link: url } });
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="myEditor"
          toolbarClassName="demo-toolbar"
          wrapperStyle={{}}
          editorStyle={{}}
          toolbarStyle={{}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              urlEnabled: true, //url上传
              uploadEnabled: true, //本地上传
              alignmentEnabled: true, //启用图片对齐方式
              uploadCallback: this.uploadImageCallBack, //图像上传回调
              previewImage: true, //配置上传后的图像弹出预览
              inputAccept: "image/*", //上传支持格式
              alt: { present: true, mandatory: false },
              defaultSize: "auto", //传递图像的默认大小
            },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}
