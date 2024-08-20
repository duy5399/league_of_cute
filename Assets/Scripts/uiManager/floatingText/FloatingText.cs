using DG.Tweening;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class FloatingText : MonoBehaviour
{
    public TextMeshProUGUI txtContent;

    [SerializeField] private Vector3 jumpEndPoint;
    [SerializeField] private float jumpPower;
    [SerializeField] private int jumpCount;
    [SerializeField] private float jumpDuration;

    private void Awake()
    {
        txtContent = GetComponentInChildren<TextMeshProUGUI>();
        jumpEndPoint = Vector3.zero;
        jumpPower = 3f;
        jumpCount = 1;
        jumpDuration = 1f;
    }

    private void Update()
    {
        transform.LookAt(Camera.main.transform, Vector3.up);
    }

    public void ShowText(string content, ColorStyle colorStyle)
    {
        txtContent.text = content;
        bool jumpLeft = false;
        switch (colorStyle)
        {
            case ColorStyle.PhysicalDamage:
            case ColorStyle.PhysicalCritDamage:
                txtContent.color = new Color32(250, 139, 67, 255);
                jumpLeft = (Random.value > 0.5f) ? true : false;
                if (jumpLeft)
                {
                    TextJumpLeft();
                }
                else
                {
                    TextJumpRight();
                }
                break;
            case ColorStyle.MagicalDamage:
                txtContent.color = new Color32(12, 169, 242, 255);
                jumpLeft = (Random.value > 0.5f) ? true : false;
                if (jumpLeft)
                {
                    TextJumpLeft();
                }
                else
                {
                    TextJumpRight();
                }
                break;
            case ColorStyle.TrueDamage:
                txtContent.color = new Color32(242, 242, 242, 255);
                TextMoveDiagonalUp();
                break;
            case ColorStyle.Heal:
                txtContent.color = new Color32(107, 236, 144, 255);
                TextMoveUp();
                break;
        }
        txtContent.DOFade(1f, 0f);
        //txtContent.DOFade(0, 2f).OnComplete(() => this.gameObject.SetActive(false));
    }

    void TextJumpRight()
    {
        jumpEndPoint = new Vector3(this.transform.position.x - 2, this.transform.position.y - 1, this.transform.position.z);
        this.transform.DOJump(jumpEndPoint, jumpPower, jumpCount, jumpDuration).OnComplete(() => this.gameObject.SetActive(false));
    }
    void TextJumpLeft()
    {
        jumpEndPoint = new Vector3(this.transform.position.x + 2, this.transform.position.y - 1, this.transform.position.z);
        this.transform.DOJump(jumpEndPoint, jumpPower, jumpCount, jumpDuration).OnComplete(() => this.gameObject.SetActive(false));
    }
    void TextMoveDiagonalUp()
    {
        this.transform.DOMove(new Vector3(this.transform.position.x + 2, this.transform.position.y + 1, this.transform.position.z), jumpDuration).OnComplete(() => this.gameObject.SetActive(false));
    }

    void TextMoveUp()
    {
        this.transform.DOMoveY(this.transform.position.y + 3, 1f).OnComplete(() => this.gameObject.SetActive(false));
    }
}
