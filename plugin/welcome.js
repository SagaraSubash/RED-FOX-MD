import config from '../config.cjs';

const gcEvent = async (m, Fox) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'welcome') {
    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    const groupMetadata = await Fox.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await Fox.decodeJid(Fox.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
    if (!senderAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");
    let responseMessage;

    if (text === 'on') {
      config.WELCOME = true;
      responseMessage = "WELCOME & LEFT message has been enabled.";
    } else if (text === 'off') {
      config.WELCOME = false;
      responseMessage = "WELCOME & LEFT message has been disabled.";
    } else {
      responseMessage = "Usage:\n- `WELCOME on`: Enable WELCOME & LEFT message\n- `WELCOME off`: Disable WELCOME & LEFT message";
    }

    try {
      await Fox.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Fox.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default gcEvent;
