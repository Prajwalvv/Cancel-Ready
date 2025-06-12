import crypto from 'crypto';

// Same encryption secret as used in the Firebase functions
const ENC_SECRET = 'CancelReadySecretKey2024!@#$%^&*';

const pad32 = (key) => {
  const buf = Buffer.from(key, 'utf8');
  if (buf.length >= 32) return buf.subarray(0, 32);
  const padded = Buffer.alloc(32);
  buf.copy(padded);
  return padded;
};

export const encrypt = (text) => {
  if (!text) return null;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', pad32(ENC_SECRET), iv);
  let enc = cipher.update(text, 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { 
    iv: iv.toString('hex'), 
    encryptedData: enc, 
    tag: tag.toString('hex') 
  };
};

export const decrypt = (obj) => {
  if (!obj) return null;
  const d = crypto.createDecipheriv('aes-256-gcm', pad32(ENC_SECRET), Buffer.from(obj.iv, 'hex'));
  d.setAuthTag(Buffer.from(obj.tag, 'hex'));
  let dec = d.update(obj.encryptedData, 'hex', 'utf8');
  dec += d.final('utf8');
  return dec;
};
