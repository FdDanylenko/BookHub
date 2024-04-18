import { Link } from "react-router-dom";

const Sidebar = () => {
  const genres = [
    {
      title: "Художні",
      links: [
        "Сучасні автори",
        "Романтична проза",
        "Детективи",
        "Історична та пригодницька проза",
        "Трилери та жахи",
        "Фантастика",
        "Фентезі",
        "Класична література",
        "Комікси та манґи",
      ],
    },
    {
      title: "Прикладні",
      links: [
        "Історія, факти та біографії",
        "Психологія",
        "Саморозвиток, мотивація",
        "Бізнес-література",
        "Дозвілля та Хобі",
        "Наукпоп",
        "Езотерика, таро",
      ],
    },
    {
      title: "Дитячі",
      links: [
        "Дітям до 4-х років",
        "Дітям 4-6 років",
        "Дітям 7-12 років",
        "Дітям від 12 років",
        "Шкільна та Навчальна",
        "Розвиваючі книги",
        "Казки і повісті",
      ],
    },
    {
      title: "Спецпропозиції",
      links: [
        "Ексклюзиви",
        "Книжки місяця",
        "Новинки",
        "Анонси",
        "Новинки партнерів",
        "Хіти продажу",
        "Подарункові книжки",
        "Розпродаж",
        "Останні примірники",
        "Тимчасово немає у продажу",
      ],
    },
  ];
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="sidebar">
      {genres.map((genre, index) => (
        <div className="sidebarBlock" key={index}>
          <div className="category">
            <Link to={`/category/${genre.title}`} className="genreLink">
              {genre.title}
            </Link>
          </div>
          <div className="list">
            {genre.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                to={`/category/${link}`}
                className="genreLink"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div
        className="genreLink toTop"
        onClick={scrollToTop}
        style={{
          textAlign: "center",
          position: "sticky",
          top: "20px",
          color: "#333333",
          fontWeight: "900",
          fontSize: "16px",
          opacity: "50%",
          margin: "20px 0 30px 0",
          transform: "translate(-10px, 0)",
        }}
      >
        ^ Наверх
      </div>
    </div>
  );
};

export default Sidebar;
