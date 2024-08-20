using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class StageTrackerManager : MonoBehaviour
{
    public static StageTrackerManager instance { get; private set; }

    [SerializeField] private TextMeshProUGUI txtCurrStage;
    [SerializeField] private TextMeshProUGUI txtCountdownTimer;
    [SerializeField] private Slider sldCountdownTimer;
    [SerializeField] private Image imgPhase;
    [SerializeField] private TextMeshProUGUI txtPhase;

    [SerializeField] private float phaseDuration;
    [SerializeField] private float remainingDuration;

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

        txtCurrStage = this.transform.GetChild(1).GetComponent<TextMeshProUGUI>();
        txtCountdownTimer = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        sldCountdownTimer = this.transform.GetChild(3).GetComponentInChildren<Slider>();
        imgPhase = this.transform.GetChild(4).GetComponent<Image>();
        txtPhase = this.transform.GetChild(4).GetComponentInChildren<TextMeshProUGUI>();

        imgPhase.gameObject.SetActive(false);
    }

    private void Start()
    {
        
    }

    private void FixedUpdate()
    {
        if(remainingDuration <= 0)
        {
            return;
        }
        remainingDuration -= Time.fixedDeltaTime;
        txtCountdownTimer.text = ((int)remainingDuration).ToString();
        sldCountdownTimer.value = remainingDuration / phaseDuration;
    }

    public void Stage(string stage)
    {
        txtCurrStage.text = stage;
    }

    public void CountdownTimer(float duration)
    {
        phaseDuration = duration;
        remainingDuration = duration;
    }


    public void SetSliderCountdownTimer(int countdownTimer, int time)
    {
        
    }

    public void Phase(string newPhase)
    {
        StartCoroutine(Coroutine_Phase(newPhase));
    }

    IEnumerator Coroutine_Phase(string newPhase)
    {
        imgPhase.gameObject.SetActive(true);
        txtPhase.text = newPhase;
        yield return new WaitForSeconds(3);
        imgPhase.gameObject.SetActive(false);
    }
}
