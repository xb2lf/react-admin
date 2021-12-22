import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props) {
    super(props);
    let fileList = [];
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false,//标识是否显示大图预览标识modal
      previewImage: '', // 大图的url
      previewTitle: '',
      fileList, //所有已上传图片文件对象的数组
      /*  fileList: [
         {
           uid: '-xxx',
           percent: 50,
           name: 'image.png',
           status: 'uploading',
           url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
         },
         {
           uid: '-5',
           name: 'image.png',
           status: 'error',
         },
       ], */
    };
  }

  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  // 隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 显示指定file对应的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  /* 
   file: 当前操作的图片文件(上传/删除)
   fileList:已上传的图片文件列表
   */
  handleChange = async ({ file, fileList }) => {
    //一旦上传成功，将当前上传的file的信息修正
    if (file.status === 'done') {
      const res = file.response;// {status : 0, data: {name:'xxx.jpg,url:'图片地址}}
      if (res.status === 0) {
        message.success('上传图片成功');
        const { url, name } = res.data;
        file = fileList[fileList.length - 1];
        file.url = url;
        file.name = name;
        file.linkProps = {};// 下载链接额外的 HTML 属性
        file.linkProps.download = url;
      } else {
        message.error('上传图片失败');
      }
    } else if (file.status === 'remove') {
      const res = await reqDeleteImg(file.name);
      if (res.status === 0) {
        message.success('删除图片成功');
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          multiple
          name="image"/* 发到后台的文件参数名 */
          maxCount={10000}
          listType="picture-card"
          fileList={fileList}/* 所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}/*  */
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
export default PicturesWall