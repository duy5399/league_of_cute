using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AccountIO : MonoBehaviour
{
    private void Start()
    {
        AccountIOStart();
    }

    #region On (lắng nghe sự kiện)
    public void AccountIOStart()
    {
        #region Đăng nhập
        SocketIO1.instance.socketManager.Socket.On<string>("login_success_no_character", (success) => {
            UIManager.instance.panelWaiting.SetActive(false);
            LoginController.instance.alertText.text = success;
            LoginController.instance.alertText.color = Color.green;
            //Nếu tài khoản chưa có nhân vật thì chuyển đến scene tạo nhân vật
            CreateCharacterController.instance.gameObject.SetActive(true);
        });

        SocketIO1.instance.socketManager.Socket.On<string>("login_success_have_character", (success) => {
            UIManager.instance.panelWaiting.SetActive(false);
            LoginController.instance.alertText.text = success;
            LoginController.instance.alertText.color = Color.green;
            //Nếu tài khoản đã có nhân vật thì chuyển đến scene client
            LoadingScreenController.instance.LoadingScene("Client", () =>
            {
                LoadingScreenController.instance.gameObject.SetActive(false);
            });
        });

        SocketIO1.instance.socketManager.Socket.On<string>("login_failure", (failure) => {
            UIManager.instance.panelWaiting.SetActive(false);
            LoginController.instance.alertText.text = failure;
            LoginController.instance.alertText.color = Color.red;
        });
        #endregion

        #region Đăng ký
        SocketIO1.instance.socketManager.Socket.On<string>("register_success", (success) => {
            UIManager.instance.panelWaiting.SetActive(false);
            RegisterController.instance.alertText.text = success;
            RegisterController.instance.alertText.color = Color.green;
        });

        SocketIO1.instance.socketManager.Socket.On<string>("register_failure", (failure) => {
            UIManager.instance.panelWaiting.SetActive(false);
            RegisterController.instance.alertText.text = failure;
            RegisterController.instance.alertText.color = Color.red;
        });
        #endregion

        #region Tạo nhân vật mới
        SocketIO1.instance.socketManager.Socket.On<string>("create_character_success", (success) => {
            UIManager.instance.panelWaiting.SetActive(false);
            CreateCharacterController.instance.alertText.text = success;
            CreateCharacterController.instance.alertText.color = Color.green;
            //Sau khi tạo nhân vật mới thành công thì chuyển đến scene client
            LoadingScreenController.instance.LoadingScene("Client", () =>
            {
                LoadingScreenController.instance.gameObject.SetActive(false);
            });
        });

        SocketIO1.instance.socketManager.Socket.On<string>("create_character_failure", (failure) => {
            UIManager.instance.panelWaiting.SetActive(false);
            CreateCharacterController.instance.alertText.text = failure;
            CreateCharacterController.instance.alertText.color = Color.red;
        });
        #endregion
    }
    #endregion

    #region Emit (gửi sự kiện)
    public void Emit_Login(string username, string password)
    {
        SocketIO1.instance.socketManager.Socket.Emit("login", JsonUtility.ToJson(new JLoginForm(username, password)));
    }

    public void Emit_Register(string username, string password, string confirmPassword, string email)
    {
        SocketIO1.instance.socketManager.Socket.Emit("register", JsonUtility.ToJson(new JRegisterForm(username, password, confirmPassword, email)));
    }

    public void Emit_CreateCharacter(string nickname)
    {
        SocketIO1.instance.socketManager.Socket.Emit("create_character", nickname);
    }
    #endregion
}

[Serializable]
public class JLoginForm
{
    public string username;
    public string password;

    public JLoginForm(string username, string password)
    {
        this.username = username;
        this.password = password;
    }
}

[Serializable]
public class JRegisterForm
{
    public string username;
    public string password;
    public string confirmPassword;
    public string email;

    public JRegisterForm(string username, string password, string confirmPassword, string email)
    {
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.email = email;
    }
}