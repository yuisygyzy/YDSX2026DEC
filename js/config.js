/* =========================================================
   炎冬岁叙 · REPO 内容配置
   ---------------------------------------------------------
   后续更换素材时，优先修改这里：
   · gallery：展品图片与说明
   · files：可下载文件
   · excerpt：试阅文字
   · freetalk：作者头像、ID 与留言
   · wall：匿名留言墙的初始留言与规则
   ========================================================= */

window.REPO_DATA = {
  gallery: [
    {
      src: "img/sample-cover-art.jpg",
      alt: "冬日主题插画封面预览，示例素材",
      tag: "COVER / 01",
      title: "雪落玉门",
      caption: "封面预览 · 示例素材，待替换",
      description: "竖幅封面位置。正式封面可直接替换 img/sample-cover-art.jpg。"
    },
    {
      src: "img/sample-snow.jpg",
      alt: "雪中并肩的两人插画，示例素材",
      tag: "SCENE / 02",
      title: "并肩",
      caption: "雪光落在肩上 · 示例素材",
      description: "横幅内页位置。正式内页可替换 img/sample-snow.jpg。"
    },
    {
      src: "img/sample-cats.jpg",
      alt: "冬日猫与角色的四格小插画，示例素材",
      tag: "MINI / 03",
      title: "猫与旧梦",
      caption: "一些毛茸茸的冬夜 · 示例素材",
      description: "小剧场位置。正式小图可替换 img/sample-cats.jpg。"
    },
    {
      src: "img/sample-collage.jpg",
      alt: "三种风格的岁末群像拼贴插画，示例素材",
      tag: "PANEL / 04",
      title: "岁末群像",
      caption: "三种颜色的岁末 · 示例素材",
      description: "拼贴展位。正式素材可替换 img/sample-collage.jpg。"
    }
  ],

  files: [
    {
      name: "谈春.docx",
      path: "txt/谈春.docx",
      type: "DOCX",
      size: "21.7 KB",
      meta: "示例长文 · 完整版",
      note: "可直接下载阅读的 Word 文档"
    },
    {
      name: "谈春-试阅.txt",
      path: "txt/谈春-试阅.txt",
      type: "TXT",
      size: "1.2 KB",
      meta: "节选试阅 · 纯文本",
      note: "放在 txt/ 文件夹中的轻量试阅文本"
    }
  ],

  excerpt: {
    kicker: "SHORT STORY / 短篇试阅",
    title: "谈春",
    paragraphs: [
      "黑白子鱼一般地在棋盘上追逐游弋着。",
      "朔执白，小巧的棋子划过沉静的佛莲纹，碰在年长些的代理人的护指上。朔颇有兴致的看着那一小点白色在自己深色的指尖上跳动，碰出些清清亮亮的脆响，等待着端坐在面前的，年少些的代理人继续这场棋局。",
      "望全心凝视着纵横交错的棋盘：做眼难活，兄长若一手打吃只怕自己先前的谋划也要白搭；粘更粘不得，自己先前做的气不够长，成事不足败事有余，几手过去定是白折腾一场……黑子被夹在白底红纹的修长手指之间，轻轻敲着棋盘。白子如星般倒映在颜色更深的那只眼睛里——那倒影随着他的目光左流右淌，拉长又融化，融化再凝结。",
      "一片花瓣静静落在纵横之间，蝶翼一般，在风中轻轻抖动。",
      "白子从黑莲的边隙滑下，武人的手指轻轻捻起这轻薄棋局的不速之客，花的柔嫩和茧的粗糙松松地贴附着，随后被放在男人的脸颊边，朔俊朗的脸贴着花瓣，金瞳微微眯起，莞尔一笑。"
    ],
    note: "节选自《谈春》，正文为示例文本。"
  },

  /* -------------------------------------------------------
     作者的话：头像 + 作者 ID + freetalk
     替换时，把头像图片放进 img/avatars/，再改这里即可。
     ------------------------------------------------------- */
  freetalk: {
    intro: "交稿之后，五位作者又被拉住，小声补充了几句。",
    authors: [
      {
        name: "朔",
        handle: "@shuo_ink",
        role: "主笔 · 《谈春》",
        avatar: "img/avatars/avatar-shuo.svg",
        avatarAlt: "作者「朔」的头像：深蓝长发、深蓝围巾与金色眼睛",
        text: "《谈春》原本只打算写三千字，结果写到雪化了还没收住。谢谢你们愿意在这个冬天，陪他们把这盘棋下完。",
        meta: "写于 12 月 21 日 · 雪",
        featured: true
      },
      {
        name: "阿杳",
        handle: "@ayao_draws",
        role: "插画 · 封面与内页",
        avatar: "img/avatars/avatar-ayao.svg",
        avatarAlt: "作者「阿杳」的头像：墨绿短发、圆框眼镜与浅蓝围巾",
        text: "封面上那片雪是凌晨三点画的。笔刷抖了一下，正好落在他肩上——就当作是冬天自己加的戏吧。",
        meta: "写于 12 月 18 日 · 晴"
      },
      {
        name: "林间",
        handle: "@linjian_lab",
        role: "装帧 · 排版与纸张",
        avatar: "img/avatars/avatar-linjian.svg",
        avatarAlt: "作者「林间」的头像：棕色短发、黑框眼镜与米白围巾",
        text: "为了找到一种「雪落在纸上」的蓝，我印坏了二十多张纸。最后选中的那张，现在还垫在显示器下面。",
        meta: "写于 12 月 20 日 · 阴"
      },
      {
        name: "雪见",
        handle: "@xuejian_pf",
        role: "校对 · 错字猎人",
        avatar: "img/avatars/avatar-xuejian.svg",
        avatarAlt: "作者「雪见」的头像：浅棕长发、白色耳罩与浅蓝外套",
        text: "校对到第七遍的时候，忽然觉得朔那句「你输了」，其实是在说别的什么。至于别的什么，你们自己猜。",
        meta: "写于 12 月 22 日 · 小雪"
      },
      {
        name: "芒",
        handle: "@mang_editor",
        role: "编辑 · 这期的主持",
        avatar: "img/avatars/avatar-mang.svg",
        avatarAlt: "编辑「芒」的头像：深色短发、梅子色围巾与笑眼",
        text: "这一期从盛夏做到初冬，中间下过一场不合时宜的雪。谢谢每一个从这里路过、并且愿意留下名字的人。",
        meta: "写于 12 月 23 日 · 风"
      }
    ]
  },

  /* -------------------------------------------------------
     匿名留言墙：初始便利贴 + 留言规则
     读者新留言只保存在浏览器 localStorage 中，不上传服务器。
     ------------------------------------------------------- */
  wall: {
    maxLength: 120,
    maxNotes: 120,
    storageKey: "yandong-wall-notes-v1",
    anonymousName: "匿名的旅人",
    colors: [
      { id: "snow", label: "雪白" },
      { id: "ice", label: "霜蓝" },
      { id: "sky", label: "浅天蓝" }
    ],
    seed: [
      { id: "seed-01", reader: "晚灯", text: "在通勤的地铁上看完了试阅，抬头的时候差点坐过站。", time: "12 月 22 日", color: "snow", rotate: -2.2 },
      { id: "seed-02", reader: "冬眠的猫", text: "雪太大了，今天不出门，就在家把这一页翻来覆去地看。", time: "12 月 22 日", color: "ice", rotate: 1.8 },
      { id: "seed-03", reader: "松果收藏家", text: "求问封面那张雪景还有别的角度吗？想存下来当壁纸。", time: "12 月 22 日", color: "snow", rotate: -1.2 },
      { id: "seed-04", reader: "路过的企鹅", text: "第一次留言，不知道说什么，就祝大家这个冬天都不冷吧。", time: "12 月 23 日", color: "sky", rotate: 2.4 },
      { id: "seed-05", reader: "白噪音", text: "下雪的晚上读《谈春》，连翻页的声音都变轻了。", time: "12 月 23 日", color: "ice", rotate: -2.8 },
      { id: "seed-06", reader: "三点半的灯", text: "那句「做眼难活」我盯了很久，好像在说棋，也像在说我最近的日子。", time: "12 月 23 日", color: "snow", rotate: 1.4 },
      { id: "seed-07", reader: "豆浆要咸的", text: "从微博一路追过来的，没想到这里真的有一整间展厅。", time: "12 月 24 日", color: "sky", rotate: -1.6 },
      { id: "seed-08", reader: "屋顶的霜", text: "已经看了三遍试阅，还是会在花瓣落下来那里停一下。", time: "12 月 24 日", color: "ice", rotate: 2.1 },
      { id: "seed-09", reader: "匿名的旅人", text: "希望明年冬天，还能在这面墙上见到大家。", time: "12 月 24 日", color: "snow", rotate: -2.4 },
      { id: "seed-10", reader: "迟到的雪", text: "来晚了，板子已经贴满一半。那就贴一张最小的，占个位置。", time: "12 月 25 日", color: "ice", rotate: 0.8 }
    ]
  }
};
