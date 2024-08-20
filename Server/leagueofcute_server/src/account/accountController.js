const { User } = require('../models/user.model');
const { Character } = require('../models/character.model');
const bcrypt = require('bcrypt')
const Joi = require('joi');
const uuid = require('uuid');
const server = require("../../server");
const { Inventory } = require('../models/inventory.model');

class AccountController{
    constructor(socketId){
        this.socketId = socketId;
        this.user = null;
    }

    awake(info){
        this.info = info;
    }

    async login(_loginData){
        console.log('login');
        const loginData = JSON.parse(_loginData);
        const checkValidate = loginReqValidate.validate(loginData);
        const { value, error } = checkValidate; 
        if (error) {
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
            server.socketIO.to(this.socketId).emit('login_failure', message);
            return null;
        }
        else{
            const user = await User.findOne({ username: loginData.username });
            const isPasswordCorrect = await bcrypt.compare(loginData.password, user?.password || "");
            //Tài khoản hoặc mật khẩu không chính xác
            if(!user || !isPasswordCorrect){
                server.socketIO.to(this.socketId).emit('login_failure', `Tài khoản hoặc Mật khẩu không chính xác!`);
                return null;
            }
    
            //Tài khoản bị cấm
            if(user.banned == 1){
                server.socketIO.to(this.socketId).emit('login_failure', `Tài khoản đã bị cấm, xin vui lòng liên hệ CSKH!`);
                return null;
            }
            
            //cập nhật thời gian đăng nhập lần cuối và lưu lại
            user.last_time_login = new Date().toLocaleString();;
            user.save();
            this.user = user;
            
            //Kiểm tra nếu tài khoản chưa có nhân vật nào => chuyển qua phần tạo nhân vật
            if(!user.haveCharacter){
                server.socketIO.to(this.socketId).emit('login_success_no_character', `Đăng nhập thành công!!!`);
                return null;
            }
            
            //Nếu tài khoản có nhân vật => lấy thông tin nhân vật và khởi tạo
            const character = await Character.findOne({ username: loginData.username });
            
            //Kiểm tra xem tài khoản có đang đăng nhập từ thiết bị khác hay không => nếu có thì buộc đăng xuất
            // let sockets = await server.socketIO.fetchSockets();
            // let anotherDevice = sockets.find(x => x.id != this.socketId && x.data.hasOwnProperty('info') && x.info.uid === character.uid);
            // if(anotherDevice){
            //     console.log(`Tài khoản đã được đăng nhập từ một thiết bị khác`);
            //     anotherDevice.data.accountController.logout();
            //     server.socketIO.to(anotherDevice.id).emit('force_logout_success', `Tài khoản đã được đăng nhập từ một thiết bị khác`);
            // }

            console.log('login success');
            server.socketIO.to(this.socketId).emit('login_success_have_character', `Đăng nhập thành công!!!`);
            return character;
        }
    }

    async register(_registerData){
        const registerData = JSON.parse(_registerData);
        const checkValidate = registerReqValidate.validate(registerData);
        const { value, error } = checkValidate; 
        if (error) {
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
            server.socketIO.to(this.socketId).emit('register_failure', message);
            return;
        }
        else{
            if(registerData.password !== registerData.confirmPassword){
                server.socketIO.to(this.socketId).emit('register_failure', `'Xác nhận mật khẩu' không chính xác`);
                return;
            }
            const user = await User.findOne({ $or: [ { username : registerData.username }, { email: registerData.email } ]});
            if (user) {
                if(user.username === registerData.username){
                    server.socketIO.to(this.socketId).emit('register_failure', `'Tên tài khoản' đã được sử dụng`);
                    return;
                }
                else if (user.email === registerData.email){
                    server.socketIO.to(this.socketId).emit('register_failure', `'Địa chỉ Email' đã được sử dụng`);
                    return;
                }
            }
            else {
                var salt = await bcrypt.genSaltSync(10);
                var passwordHashed = await bcrypt.hash(registerData.password, salt);
        
                var newUser = new User({
                    username: registerData.username,
                    password: passwordHashed,
                    email: registerData.email,
                    create_time: new Date().toLocaleString(),
                    last_time_login: new Date().toLocaleString()
                });
        
                await newUser.save();

                server.socketIO.to(this.socketId).emit('register_success', 'Đăng ký thành công!');
            }
        }
    }

    async logout(){
        try{
            clearInterval(this.info.hpRegenIntervalId);
            await this.info.saveBeforeExit();
            // this.user = null;
            // this.socket.info = null;
            // this.socket.data.currentState = null;
            // this.socket.animController = null;
            // this.socket.moveController = null;
            // this.socket.friendController = null;
            // this.socket.skillController = null;
            // this.socket.buff = null;
            // this.socket.chatController = null;
            // this.socket.data.mapController = null;
        }
        catch{
            console.log(this.info.nickname+ ": logut error");
        }
    };

    async createCharacter(nickname){
        const nicknameJSON = { nickname : nickname}
        const checkValidate = nicknameValidate.validate(nicknameJSON);
        const { value, error } = checkValidate; 
        if (error) {
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
            server.socketIO.to(this.socketId).emit('create_character_failure', message);
            return;
        }
        else{
            const character = await Character.findOne({ nickname });
            if(character){
                server.socketIO.to(this.socketId).emit('create_character_failure', `'Tên hiển thị' đã được sử dụng!`);
                return;
            }
    
            var newCharacter = new Character({
                uid : uuid.v4(),
                username: this.user.username,
                nickname: nickname,
                create_time : new Date().toLocaleString(),
            });

            var newInventory = new Inventory({
                uid: newCharacter.uid,
            });

            await newCharacter.save();
            await newInventory.save();
    
            this.user.haveCharacter = true;
            await this.user.save();
            
            server.socketIO.to(this.socketId).emit('create_character_success', `Tạo nhân vật thành công!!!`); 
        }
    };
}

module.exports = { AccountController }

const loginReqValidate = Joi.object({
    username: Joi.string().alphanum().required().messages({
        'string.base': `'Tên tài khoản' không phải là một chuỗi`,
        'string.empty': `Vui lòng nhập 'Tên tài khoản'`,
        'string.alphanum': `'Tên tài khoản' chỉ được chứa ký tự chữ và số`,
        'any.required': `Vui lòng nhập 'Tên tài khoản'`
      }),
    password: Joi.string().alphanum().required().messages({
        'string.empty': `Vui lòng nhập 'Mật khẩu'`,
        'string.alphanum': `'Mật khẩu' chỉ được chứa ký tự chữ và số`,
        'any.required': `Vui lòng nhập 'Mật khẩu'`
      })
});

const registerReqValidate = Joi.object({
    username: Joi.string().alphanum().min(5).max(30).required().messages({
        'string.base': `'Tên tài khoản' không phải là một chuỗi`,
        'string.empty': `Vui lòng nhập 'Tên tài khoản'`,
        'string.alphanum': `'Tên tài khoản' chỉ được chứa ký tự chữ và số`,
        'string.min': `'Tên tài khoản' phải có ít nhất {#limit} ký tự`,
        'string.max': `'Tên tài khoản' giới hạn {#limit} ký tự`,
        'any.required': `Vui lòng nhập 'Tên tài khoản'`
      }),
    password: Joi.string().alphanum().pattern(new RegExp("^[a-zA-Z0-9@]{5,30}$")).required().messages({
        'string.empty': `Vui lòng nhập 'Mật khẩu'`,
        'string.alphanum': `'Mật khẩu' chỉ được chứa ký tự chữ và số`,
        "string.pattern.base": `'Mật khẩu' phải ít nhất 6 ký tự`,
        'any.required': `Vui lòng nhập 'Mật khẩu'`
      }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': `'Nhập lại mật khẩu' không chính xác`
      }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        'string.base': `'Địa chỉ email' không phải là một chuỗi`,
        'string.empty': `Vui lòng nhập 'Địa chỉ email'`,
        'string.email': `'Địa chỉ email' không hợp lệ`,
        'any.required': `Vui lòng nhập 'Địa chỉ email'`
      }),
});

const nicknameValidate = Joi.object({
    nickname: Joi.string().min(3).max(12).required().messages({
        'string.base': `'Tên nhân vật' không phải là một chuỗi`,
        'string.empty': `Vui lòng nhập 'Tên nhân vật'`,
        'string.min': `'Tên nhân vật' phải có ít nhất {#limit} ký tự`,
        'string.max': `'Tên nhân vật' giới hạn {#limit} ký tự`,
        'any.required': `Vui lòng nhập 'Tên nhân vật'`
      })
});