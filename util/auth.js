import jwt from "jsonwebtoken"; 

const secret = "Super@$uper#123";
function createToken(user){
  const payload = {
    _id: user._id,
    email: user.email,
    profileimg: user.profileimg,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token){
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

export { validateToken, createToken };
