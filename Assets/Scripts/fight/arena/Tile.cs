using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Tile : MonoBehaviour
{
    public JTile tile;
    [SerializeField] private Renderer _renderer;
    [SerializeField] private MeshRenderer meshRenderer;

    private void Awake()
    {
        _renderer = this.GetComponent<Renderer>();
        meshRenderer = this.GetComponent<MeshRenderer>();
    }

    public void ChangeBorder(bool isActive)
    {
        if (isActive)
        {
            _renderer.material.SetColor("_Color", new Color32(61, 234, 255, 255));
        }
        else
        {
            _renderer.material.SetColor("_Color", new Color32(53, 132, 160, 255));
        }
    }

    public void Active(bool boolean)
    {
        meshRenderer.enabled = boolean;
    }
}
