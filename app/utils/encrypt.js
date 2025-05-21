import crypto from 'crypto';

export const encrypt = (data, secretKey) => {
  const iv = crypto.randomBytes(16);  
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
};

export const getEncryptedCartUrl = (data, secretKey) => {
  const cartString = JSON.stringify(data); 
  const { encrypted, iv } = encrypt(cartString, secretKey);
  return `/cart?data=${encrypted}&iv=${iv}`;
};