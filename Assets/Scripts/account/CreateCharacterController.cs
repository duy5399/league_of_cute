using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class CreateCharacterController : MonoBehaviour
{
    public static CreateCharacterController instance { get; private set; }

    [SerializeField] private TMP_InputField inputNickname;
    [SerializeField] private Button btnConfirm;
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
        inputNickname = transform.GetChild(2).GetComponent<TMP_InputField>();
        btnConfirm = transform.GetChild(3).GetComponent<Button>();
        alertText = transform.GetChild(4).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        inputNickname.text = string.Empty;
        btnConfirm.onClick.AddListener(OnClick_CreateCharacter);
        alertText.text = string.Empty;
    }

    private void OnDisable()
    {
        inputNickname.text = string.Empty;
        btnConfirm.onClick.RemoveListener(OnClick_CreateCharacter);
        alertText.text = string.Empty;
    }

    void Start()
    {

    }

    void Update()
    {

    }

    void OnClick_CreateCharacter()
    {
        if (inputNickname.text == string.Empty)
        {
            alertText.text = "Vui lòng nhập Tên hiển thị";
            alertText.color = new Color32(255, 0, 0, 255);
            return;
        }
        alertText.text = string.Empty;
        UIManager.instance.panelWaiting.SetActive(true);
        SocketIO1.instance.accountIO.Emit_CreateCharacter(inputNickname.text);
    }
}
