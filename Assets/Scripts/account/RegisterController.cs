using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class RegisterController : MonoBehaviour
{
    public static RegisterController instance { get; private set; }

    [SerializeField] private TMP_InputField inputUsername;
    [SerializeField] private TMP_InputField inputPassword;
    [SerializeField] private TMP_InputField inputConfirmPassword;
    [SerializeField] private TMP_InputField inputEmail;
    [SerializeField] private Toggle togglePrivacyPolicy;
    [SerializeField] private Button btnRegister;
    [SerializeField] private Button btnLoginForm;
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
        inputConfirmPassword = transform.GetChild(3).GetComponent<TMP_InputField>();
        inputEmail = transform.GetChild(4).GetComponent<TMP_InputField>();
        togglePrivacyPolicy = transform.GetChild(5).GetComponent<Toggle>();
        btnRegister = transform.GetChild(6).GetComponent<Button>();
        btnLoginForm = transform.GetChild(7).GetComponent<Button>();
        alertText = transform.GetChild(8).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        inputUsername.text = string.Empty;
        inputPassword.text = string.Empty;
        inputConfirmPassword.text = string.Empty;
        inputEmail.text = string.Empty;
        togglePrivacyPolicy.isOn = false;
        btnRegister.onClick.AddListener(OnClick_Register);
        btnLoginForm.onClick.AddListener(OnClick_LoginForm);
        alertText.text = string.Empty;
    }

    private void OnDisable()
    {
        inputUsername.text = string.Empty;
        inputPassword.text = string.Empty;
        inputConfirmPassword.text = string.Empty;
        inputEmail.text = string.Empty;
        togglePrivacyPolicy.isOn = false;
        btnRegister.onClick.RemoveListener(OnClick_Register);
        btnLoginForm.onClick.RemoveListener(OnClick_LoginForm);
        alertText.text = string.Empty;
    }

    void Start()
    {

    }

    void Update()
    {

    }

    void OnClick_Register()
    {
        if (inputUsername.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Tên tài khoản!";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        else if (inputPassword.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Mật khẩu!";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        else if (inputConfirmPassword.text == string.Empty)
        {
            alertText.text = "Vui lòng xác nhận lại mật khẩu!";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        else if (inputEmail.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập email!";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        else if(!togglePrivacyPolicy.isOn)
        {
            alertText.text = "Vui lòng cho biết rằng bạn đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        alertText.text = string.Empty;
        UIManager.instance.panelWaiting.SetActive(true);
        SocketIO1.instance.accountIO.Emit_Register(inputUsername.text, inputPassword.text, inputConfirmPassword.text, inputEmail.text);
    }

    void OnClick_LoginForm()
    {
        LoginController.instance.gameObject.SetActive(true);
        this.gameObject.SetActive(false);
    }
}
