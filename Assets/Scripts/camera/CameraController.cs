using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public static CameraController instance { get; private set; }

    private void Awake()
    {
        if (instance != null && instance != this)
            Destroy(this);
        else
            instance = this;
    }

    void Update()
    {
        
    }

    public void SetCameraHome(Vector3 position)
    {
        Debug.Log("SetCameraHome: " + position);
        transform.position = new Vector3(position.x, 20, -16);
        transform.rotation = Quaternion.Euler(60, 0, 0);
        //transform.eulerAngles = new Vector3(60, 0, 0);
    }

    public void SetCameraAway(Vector3 position)
    {
        Debug.Log("SetCameraAway: " + position);
        transform.position = new Vector3(position.x, 20, 13);
        transform.rotation = Quaternion.Euler(60, 180, 0);
        //transform.eulerAngles = new Vector3(60, 180, 0);
    }
}
