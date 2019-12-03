module.exports = {
    generateHash,
    jsonParse,
};

function generateHash(targetLength) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < targetLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
};

function jsonParse(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}