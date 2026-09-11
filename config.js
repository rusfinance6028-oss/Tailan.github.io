window.APP_CONFIG = {
  googleSheetId: "1Uao8sbqjIJmU5loWxaWXYAS4XR9UMH2x7K5ZkTfqtiI",
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1Uao8sbqjIJmU5loWxaWXYAS4XR9UMH2x7K5ZkTfqtiI/edit?usp=sharing",
  refreshSeconds: 45,

  // Анхны нууц үг: admin / Zarlaga2026   |   user / Tailan2026
  users: [
    {
      username: "admin",
      name: "Админ",
      passHash: "07d1475e66eb2afa8e317def3e01c10e1d39af99bd10de26edf23d2312ec320f"
    },
    {
      username: "user",
      name: "Хэрэглэгч",
      passHash: "519d6c4a704b174327c7979f2fb7ccf03c463e57e59183b78fa8888fc6a168c6"
    }
  ],

  sheets: {
    overview: { gid: "89063895", names: ["Ерөнхий төсөв"] },
    main: { gid: "569840074", names: ["1. Үндсэн "] },
    server: { gid: "483433955", names: ["2. Сервер, хэрэгслүүд"] },
    fitout: { gid: "1613939352", names: ["3.Бусад тохижилт хяналтын зарда"] },
    other: { gid: "1853443960", names: ["4. Бусад "] }
  }
};
