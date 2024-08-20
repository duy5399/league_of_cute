using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ForgotPasswordController : MonoBehaviour
{
    public static ForgotPasswordController instance { get; private set; }

    [SerializeField] private TMP_InputField inputUsername;
    [SerializeField] private Button btnSend;
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
        inputUsername = transform.GetChild(2).GetComponent<TMP_InputField>();
        btnSend = transform.GetChild(3).GetComponent<Button>();
        btnLoginForm = transform.GetChild(4).GetComponent<Button>();
        alertText = transform.GetChild(5).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        inputUsername.text = string.Empty;
        btnSend.onClick.AddListener(OnClick_SendEmail);
        btnLoginForm.onClick.AddListener(OnClick_LoginForm);
        alertText.text = string.Empty;
    }

    private void OnDisable()
    {
        inputUsername.text = string.Empty;
        btnSend.onClick.RemoveListener(OnClick_SendEmail);
        btnLoginForm.onClick.RemoveListener(OnClick_LoginForm);
        alertText.text = string.Empty;
    }

    void Start()
    {

    }

    void Update()
    {

    }

    void OnClick_SendEmail()
    {
        if (inputUsername.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Tên tài khoản";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        //SocketIO1.instance.accountIO.Emit_Login(inputUsername.text, inputPass.text);
    }

    void OnClick_LoginForm()
    {
        LoginController.instance.gameObject.SetActive(true);
        this.gameObject.SetActive(false);
    }
}
