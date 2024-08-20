using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LoginController : MonoBehaviour
{
    public static LoginController instance { get; private set; }

    [SerializeField] private TMP_InputField inputUsername;
    [SerializeField] private TMP_InputField inputPassword;
    [SerializeField] private Button btnLogin;
    [SerializeField] private Button btnRegisterForm;
    [SerializeField] private Button btnForgotPasswordForm;
    [SerializeField] private TextMeshProUGUI _alertText;

    public TextMeshProUGUI alertText
    {
        get { return _alertText; }
        set { _alertText = value; }
    }
    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(this);
        }
        else
        {
            instance = this;
        }
        inputUsername = transform.GetChild(1).GetComponent<TMP_InputField>();
        inputPassword = transform.GetChild(2).GetComponent<TMP_InputField>();
        btnLogin = transform.GetChild(3).GetComponent<Button>();
        btnRegisterForm = transform.GetChild(4).GetComponent<Button>();
        btnForgotPasswordForm = transform.GetChild(5).GetComponent<Button>();
        alertText = transform.GetChild(6).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        inputUsername.text = string.Empty;
        inputPassword.text = string.Empty;
        btnLogin.onClick.AddListener(OnClick_Login);
        btnRegisterForm.onClick.AddListener(OnClick_RegiterForm);
        btnForgotPasswordForm.onClick.AddListener(OnClick_ForgotPasswordForm);
        alertText.text = string.Empty;
    }

    private void OnDisable()
    {
        inputUsername.text = string.Empty;
        inputPassword.text = string.Empty;
        btnLogin.onClick.RemoveListener(OnClick_Login);
        btnRegisterForm.onClick.RemoveListener(OnClick_RegiterForm);
        btnForgotPasswordForm.onClick.RemoveListener(OnClick_ForgotPasswordForm);
        alertText.text = string.Empty;
    }

    void Start()
    {

    }

    void Update()
    {

    }

    void OnClick_Login()
    {
        if(inputUsername.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Tên tài khoản";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        if (inputPassword.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Mật khẩu";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        Debug.Log("login request");
        alertText.text = string.Empty;
        UIManager.instance.panelWaiting.SetActive(true);
        SocketIO1.instance.accountIO.Emit_Login(inputUsername.text, inputPassword.text);
    }

    void OnClick_RegiterForm()
    {
        RegisterController.instance.gameObject.SetActive(true);
        this.gameObject.SetActive(false);
    }

    void OnClick_ForgotPasswordForm()
    {
        ForgotPasswordController.instance.gameObject.SetActive(true);
        this.gameObject.SetActive(false);
    }
}
