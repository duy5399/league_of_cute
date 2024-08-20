using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using UnityEngine;

public class SkillEffect : MonoBehaviour
{
    //private Seq<MeshRenderer> _meshRenderLst;
    //private Seq<TrailRenderer> _trailRenderLst;
    //private Seq<Transform> _sonTransforms;

    [SerializeField] private List<ParticleSystem> _particleSystemLst;

    public bool isFollowParent;

    protected List<ParticleSystem> particleSystemLst
    {
        get
        {
            if (_particleSystemLst == null)
            {
                _particleSystemLst = GetComponentsInChildren<ParticleSystem>().ToList();
            }
            return _particleSystemLst;
        }
    }

    protected virtual void Awake()
    {
        _particleSystemLst = GetComponentsInChildren<ParticleSystem>().ToList();
    }

    public virtual void Play()
    {
        particleSystemLst.ForEach(p =>
        {
            p.Play();
        });
    }

    public virtual void Stop()
    {
        particleSystemLst.ForEach(p =>
        {
            p.Stop();
        });
    }

    public void OnEnable()
    {
        Play();
    }

    public void OnDisable()
    {
        Stop();
    }

    private void FixedUpdate()
    {
        if (isFollowParent)
        {
            base.transform.position = base.transform.parent.position;
            base.transform.rotation = base.transform.parent.rotation;
        }
    }
}
