using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class BattleResultManager : MonoBehaviour
{
    public static BattleResultManager instance { get; private set; }
    [SerializeField] private Image imgBackground;
    [SerializeField] private TextMeshProUGUI txtTitle;
    [SerializeField] private TextMeshProUGUI txtPlace;
    [SerializeField] private Button btnConfirm;

    private void Awake()
    {
        if (instance == null && instance != this)
        {
            instance = this;
        }
        else
        {
            Destroy(this);

        }
        imgBackground = this.transform.GetChild(0).GetComponent<Image>();
        txtTitle = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        txtPlace = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        btnConfirm = this.transform.GetChild(3).GetComponent<Button>();
    }

    private void OnEnable()
    {
        btnConfirm.onClick.AddListener(OnClick_GoToLeaderboard);
        imgBackground.gameObject.SetActive(false);
        txtTitle.gameObject.SetActive(false);
        txtPlace.gameObject.SetActive(false);
        btnConfirm.gameObject.SetActive(false);
    }

    private void OnDisable()
    {
        btnConfirm.onClick.RemoveListener(OnClick_GoToLeaderboard);
    }

    public void OnDisableScreen()
    {
        imgBackground.gameObject.SetActive(true);
        txtTitle.gameObject.SetActive(false);
        txtPlace.gameObject.SetActive(true);
        btnConfirm.gameObject.SetActive(false);
        txtPlace.text = "ĐANG CHỜ GIAO TRANH";
    }

    public void OnSetBattleResult(int standing)
    {
        imgBackground.gameObject.SetActive(true);
        txtTitle.gameObject.SetActive(true);
        txtPlace.gameObject.SetActive(true);
        btnConfirm.gameObject.SetActive(true);
        switch (standing)
        {
            case 0:
                txtPlace.text = "HẠNG NHẤT";
                break;
            case 1:
                txtPlace.text = "HẠNG NHÌ";
                break;
            case 2:
                txtPlace.text = "HẠNG BA";
                break;
            case 3:
                txtPlace.text = "HẠNG TƯ";
                break;
            case 4:
                txtPlace.text = "HẠNG NĂM";
                break;
            case 5:
                txtPlace.text = "HẠNG SÁU";
                break;
            case 6:
                txtPlace.text = "HẠNG BẢY";
                break;
            case 7:
                txtPlace.text = "HẠNG TÁM";
                break;
        }
    }

    public void OnClick_GoToLeaderboard()
    {
        SocketIO1.instance.scoreboardIO.Emit_DisplayScoreboard();
    }
}
