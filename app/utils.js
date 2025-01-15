//password match
async function matchPassword(password, hash) {
  return hash === (await hashPassword(password));
}
//password hash
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

//paragraph data

const paragraphs = [
  "It was the best of times, it was the worst of times, the age of wisdom, the age of foolishness, the epoch of belief, the epoch of incredulity.",
  "All happy families are alike, but each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house, causing quite a stir.",
  "Call me Ishmael. Some years ago, I had little money and decided to sail the seas, exploring the watery part of the world, seeking adventure and purpose.",
  "In my younger years, my father gave me advice: 'Before criticizing others, remember that not everyone has had your advantages. Show understanding and kindness wherever possible.'",
  "It is a truth universally acknowledged that a single man in possession of fortune must be in want of a wife. Society never fails to make this assumption.",
  "Once upon a time, a moocow came down the road and met a boy named baby tuckoo. The meeting was simple but marked the start of a curious journey.",
  "A screaming comes across the sky. It's late, the evacuation proceeds, but it feels like theater. The urgency of the moment fills the air with tension.",
  "Mr. and Mrs. Dursley, of Privet Drive, were proud to say they were perfectly normal. They believed their lives were ordinary, hiding secrets they'd never reveal.",
];

function randomParagraph() {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

export { matchPassword, hashPassword, randomParagraph };
