using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class MatchFound : MonoBehaviour
{
    public static MatchFound instance { get; private set; }

    [SerializeField] private Button btnAccept;
    [SerializeField] private Button btnDecline;
    [SerializeField] private Image imgCooldown;
    [SerializeField] private TextMeshProUGUI txtCooldown;


    [SerializeField] private float timeToAccept;
    [SerializeField] private float remainingTime;

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

        imgCooldown = this.transform.GetChild(1).GetChild(1).GetComponent<Image>();
        btnAccept = this.transform.GetChild(2).GetComponent<Button>();
        btnDecline = this.transform.GetChild(3).GetComponent<Button>();
        txtCooldown = this.transform.GetChild(4).GetComponent<TextMeshProUGUI>();
    }

    private void OnEnable()
    {
        timeToAccept = 5f;
        remainingTime = 5f;
        imgCooldown.fillAmount = 1f;
        btnAccept.interactable = true;
        btnDecline.interactable = true;
        btnAccept.onClick.AddListener(OnClick_Accept);
        btnDecline.onClick.AddListener(OnClick_Decline);
    }

    private void OnDisable()
    {
        btnAccept.onClick.RemoveListener(OnClick_Accept);
        btnDecline.onClick.RemoveListener(OnClick_Decline);
    }

    void FixedUpdate()
    {
        if(remainingTime <= 0f)
        {
            return;
        }
        remainingTime -= Time.fixedDeltaTime;
        imgCooldown.fillAmount = (remainingTime / timeToAccept);
        txtCooldown.text = ((int)remainingTime).ToString();
    }

    private void OnClick_Accept()
    {
        SocketIO1.instance.lobbyIO.Emit_AcceptMatchFound();
        btnAccept.interactable = false;
        btnDecline.interactable = false;
    }

    private void OnClick_Decline()
    {
        SocketIO1.instance.lobbyIO.Emit_DeclineMatchFound();
        btnAccept.interactable = false;
        btnDecline.interactable = false;
    }
}
