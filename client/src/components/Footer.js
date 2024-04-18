import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerLinks">
        <div className="linksGroup">
          <div className="titleGroup">
            <div className="linkIcon deliveryLinkIcon"></div>
            <div className="title">Способи доставки</div>
          </div>
          <div className="linksBox">
            <div className="link">Відділення Нової пошти</div>
            <div className="link">Поштомат Нової пошти</div>
            <div className="link">Кур'єр Meest</div>
            <div className="link">Відділення Укрпошти</div>
            <div className="link">Безкоштовна доставка*</div>
            <div className="linkIcon ukrPLinkIcon"></div>
          </div>
        </div>
        <div className="linksGroup">
          <div className="titleGroup">
            <div className="linkIcon aboutLinkIcon"></div>
            <div className="title">Про BookHub</div>
          </div>
          <div className="linksBox">
            <div className="link">Новини</div>
            <div className="link">Книжковий дайджест</div>
            <div className="link">Анонси</div>
          </div>
        </div>
        <div className="linksGroup">
          <div className="titleGroup">
            <div className="linkIcon mailLinkIcon"></div>
            <div className="title">Контакти</div>
          </div>
          <div className="linksBox">
            <div className="link">Адреса:«BookHub», а/с 84,</div>
            <div className="link">Харків, 61001</div>
            <div className="link">Тел.: 0 800 301 090</div>
            <div className="link">Web: bookhub.ua</div>
            <div className="link">#bookhub</div>
          </div>
        </div>
        <div className="linksGroup">
          <div className="titleGroup">
            <div className="linkIcon payLinkIcon"></div>
            <div className="title">Способи оплати</div>
          </div>
          <div className="linksBox">
            <div className="link">Оплата картою онлайн</div>
            <div className="link">Оплата на момент отримання</div>
            <div className="link">
              <div className="linkIcon paymentLinkIcon"></div>
            </div>
          </div>
        </div>
        <div className="linksGroup">
          <div className="titleGroup">
            <div className="linkIcon helpLinkIcon"></div>
            <div className="title">Є питання?</div>
          </div>
          <div className="linksBox">
            <div className="link">Як замовити?</div>
            <div className="link">Доставка, оплата</div>
            <div className="link">Налаштування</div>
            <div className="link">Порядок повернення товарів</div>
            <div className="link">Постійним клієнтам</div>
          </div>
        </div>
        <div className="linksGroup">
          <div className="linksBox SocLinksBox">
            <div className="link">
              <div className="socIcon facebook"></div>
            </div>
            <div className="link">
              <div className="socIcon telegram"></div>
            </div>
            <div className="link">
              <div className="socIcon instagram"></div>
            </div>
            <div className="link">
              <div className="socIcon twitter"></div>
            </div>
            <div className="link">
              <div className="socIcon tiktok"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">© 2024 «BookHub»</div>
    </footer>
  );
};

export default Footer;
