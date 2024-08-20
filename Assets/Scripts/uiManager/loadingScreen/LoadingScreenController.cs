using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class LoadingScreenController : MonoBehaviour
{
    public static LoadingScreenController instance { get; private set; }

    [SerializeField] private Image imgBackground;
    [SerializeField] private Slider sliderProcess;
    [SerializeField] private TextMeshProUGUI txtProcess;
    [SerializeField] private Transform tfLstPlayerInfo;

    [SerializeField] private List<string> lstBackground;


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

        imgBackground = this.transform.GetChild(0).GetComponent<Image>();
        sliderProcess = this.transform.GetChild(1).GetComponent<Slider>();
        txtProcess = this.transform.GetChild(2).GetComponent<TextMeshProUGUI>();
        tfLstPlayerInfo = this.transform.GetChild(3).transform;
        lstBackground = new List<string>()
        {
            "textures/backgrounds/tft_wallpaper",
            "textures/backgrounds/surima_wallpaper"
        };

    }

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
        tfLstPlayerInfo.gameObject.SetActive(false);
    }
    void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
        tfLstPlayerInfo.gameObject.SetActive(false);
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        //scene.buildIndex == 1
        if (scene.name == "Client")
        {
            FriendListManager.instance.GetFriendList();
            AddFriendManager.instance.GetSentRequests();
            FriendRequestsManager.instance.GetFriendRequests();
            LobbyListManager.instance.GetLobbyList();
            StoreManager.instance.GetStore();
        }
        else if (scene.buildIndex == 2)
        {
            
        }
    }

    public void LoadingScene(string sceneName, Action func = null)
    {
        this.gameObject.SetActive(true);
        StartCoroutine(LoadingSceneAsync(sceneName, func));
    }

    IEnumerator LoadingSceneAsync(string sceneName, Action func = null)
    {
        //Tải ảnh nền ngẫu nhiên
        int randomBackground = UnityEngine.Random.Range(0, 2);
        imgBackground.sprite = Resources.Load<Sprite>(randomBackground < lstBackground.Count ? lstBackground[randomBackground] : lstBackground[0]);

        AsyncOperation loadOperation = SceneManager.LoadSceneAsync(sceneName);
        //Cập nhật thanh tiến trình
        while (!loadOperation.isDone)
        {
            float progressValue = Mathf.Clamp01(loadOperation.progress / 0.9f);
            sliderProcess.value = progressValue;
            int progressValue1 = (int)progressValue * 100;
            txtProcess.text = progressValue1.ToString() + "%";
            Debug.Log("loadOperation.progress: " + loadOperation.progress);
            Debug.Log("progressValue: " + progressValue);
            Debug.Log("progressValue1: " + progressValue1);
            yield return null;
        }
        if (func != null)
        {
            func();
        }
    }

    //Hiển thị thông tin của tất cả người chơi khi tải cảnh
    public void DisplayListPlayerInfo(List<JPlayerInfo> playerInfos)
    {
        tfLstPlayerInfo.gameObject.SetActive(true);
        foreach (JPlayerInfo playerInfo in playerInfos)
        {
            GameObject decalPath = Resources.Load<GameObject>("prefabs/fight/loading/Decal_InfoPlayer");
            GameObject decal = Instantiate(decalPath, tfLstPlayerInfo);
            LoadingScreen_DecalPlayerInfo decalPlayerInfo = decal.GetComponent<LoadingScreen_DecalPlayerInfo>();
            decalPlayerInfo.Info(playerInfo);
        }
    }
}
