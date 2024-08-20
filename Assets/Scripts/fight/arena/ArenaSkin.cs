using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArenaSkin : MonoBehaviour
{
    public static ArenaSkin instance { get; private set; }
    [SerializeField] private Renderer meshRenderer;

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

        meshRenderer = this.transform.GetChild(1).GetComponent<Renderer>();
    }

    public void ChangeArenaSkin(string arenaSkin)
    {
        var materialsCopy = meshRenderer.materials;
        Material newMaterial = Resources.Load<Material>("textures/arenaSkin/" + arenaSkin);
        materialsCopy[8] = newMaterial;
        meshRenderer.materials = materialsCopy;
    }
}
