import React, { Component } from 'react';
import Modal from 'react-modal';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../asset/contacts.css';

function onChange(value) {
  console.log('Captcha value:', value);
}

Modal.setAppElement('#root');

const formRef = React.createRef();
const recaptchaRef = React.createRef();
const phoneExp = /^\d{7,10}$/;

class Contacts extends Component {
  customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name: '',
      email: '',
      phone: '',
      message: '',
    };
  }

  componentDidMount() {
    const form = formRef.current;
    console.log(form);
    form.reset();
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    document.body.appendChild(script);
    // fetch('https://ramen-chatroom.herokuapp.com')
    //   .then((result) => result.json())
    //   .then((res) => console.log(res));
  }

  setname = (e) => {
    this.setState({ name: e.target.value });
  };

  setemail = (e) => {
    this.setState({ email: e.target.value });
  };

  setphone = (e) => {
    document.querySelector('#phone').setCustomValidity('');
    this.setState({ phone: +e.target.value });
  };

  setmessage = (e) => {
    this.setState({ message: e.target.value });
  };

  validate = () => {
    const form = formRef.current;
    // let check = false;
    const { email, phone, message } = this.state;

    // select選擇棄沒辦法設置在外面，生成dom的時候尚未render，不然就要在constructor前指定原型
    if (phoneExp.test(phone) === false) {
      document.querySelector('#phone').setCustomValidity('號碼需7~10碼');
      return false;
    }
    document.querySelector('#phone').setCustomValidity('');

    return form.reportValidity();
  };

  showModal = (e) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current.getValue();
    if (recaptchaValue === '') return alert('請先google驗證');

    if (this.validate()) {
      // console.log(recaptchaValue);
      return this.setState({ modalIsOpen: true });
    }
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  onSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log(`ID: ${profile.getId()}`); // Do not send to your backend! Use an ID token instead.
    console.log(`Name: ${profile.getName()}`);
    console.log(`Image URL: ${profile.getImageUrl()}`);
    console.log(`Email: ${profile.getEmail()}`); // This is null if the 'email' scope is not present.
  };

  sendMail = () => {
    // todo 設定收件人跟取得資料設定
    // const {
    //   name,
    //   email,
    //   phone,
    //   message,
    // } = this.state;
    // const mailTo = document.querySelector('#mailTo');
    // const to = 'it.brucechen@gmail.com';
    // const subject = '關於拉麵地圖問題';
    // let body = `詢問人: ${name} %0A%0A%0A`;
    // body += `電話: ${phone} %0A`;
    // body += `信箱: ${email} %0A`;
    // body += `訊息: ${message} %0A`;
    // mailTo.href = `mailto:${to}?subject=${subject}&body=${body}`;
    // mailTo.click();
  };

  render() {
    const {
      modalIsOpen, name, email, phone, message,
    } = this.state;
    return (
      <>
        <Navbar />
        <section className="container contactMsg">
          <div className="contactLeft pt-2">
            <h2>單純吃拉麵的紀錄</h2>
            <div className="row m-0">
              <div className="col-6 p-0">
                <p>作者:陳以十</p>
                <p>
                  我的:
                  <a href="https://github.com/monkeychen528">github</a>
                </p>
                <p>E-mail：monkeychen528@gmail.com</p>
              </div>
            </div>
            <div className="userWrap">
              <img src="images/author.jpg" alt="" />
            </div>
          </div>
          <div className="contactRight pt-2">
            <p>任何問題都歡迎您透過以下表單詢問，我們會盡快回覆您！</p>
            <form ref={formRef}>
              <input placeholder="名字" required onChange={this.setname} />
              <input
                type="email"
                placeholder="信箱"
                required
                onChange={this.setemail}
              />
              <input
                id="phone"
                type="number"
                placeholder="電話"
                required
                onChange={this.setphone}
              />
              <textarea
                placeholder="請留下你的訊息"
                onChange={this.setmessage}
              />
              <ReCAPTCHA
                sitekey="6LceQNoUAAAAAGh_LcEkvu43qxaCiudBleGwjUn1"
                onChange={onChange}
                ref={recaptchaRef}
              />
              <div className="g-signin2" data-onsuccess="onSignIn" />
              {/* <div className="g-recaptcha" data-sitekey="6LceQNoUAAAAAGh_LcEkvu43qxaCiudBleGwjUn1" /> */}
              <button
                type="submit"
                onClick={this.showModal}
                className="contactbtn"
              >
                送出
              </button>
            </form>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={this.closeModal}
              style={this.customStyles}
              contentLabel="Example Modal"
            >
              <form id="myform" encType="text/plain" acceptCharset="utf-8">
                <input placeholder="名字" disabled defaultValue={name} />
                <input
                  type="email"
                  placeholder="信箱"
                  disabled
                  defaultValue={email}
                />
                <input
                  type="number"
                  placeholder="電話"
                  disabled
                  defaultValue={phone}
                />
                <textarea placeholder="請留下你的訊息" defaultValue={message} />
                {/* 我不是機器人驗證 */}
                <button
                  type="submit"
                  className="contactbtn"
                  onClick={this.sendMail}
                >
                  送出
                  {/* <a id="mailTo" /> */}
                </button>
              </form>
            </Modal>
          </div>
        </section>
        <Footer />
      </>
    );
  }
}

export default Contacts;
