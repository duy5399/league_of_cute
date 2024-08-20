using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using UnityEngine.UI;

public class TacticianMove : MonoBehaviour
{
    [SerializeField] private NetworkObject networkObject;
    [SerializeField] private TacticianState tacticianState;
    public NavMeshAgent navMeshAgent;
    [SerializeField] private PetControls petControls_input;
    [SerializeField] private ParticleSystem clickEffect;
    [SerializeField] private LayerMask layerMaskTerrain;
    [SerializeField] private bool isIdle;

    private void Awake()
    {
        networkObject = this.GetComponent<NetworkObject>();
        tacticianState = this.GetComponent<TacticianState>();
        navMeshAgent = this.GetComponent<NavMeshAgent>();
        petControls_input = new PetControls();
        layerMaskTerrain = LayerMask.GetMask("Terrain");
        isIdle = true;
        AssignInputs();
    }

    private void Start()
    {

    }

    private void OnEnable()
    {
        petControls_input.Enable();
    }

    private void OnDisable()
    {
        petControls_input.Disable();
    }

    void Update()
    {
        FaceToTarget();
    }

    void AssignInputs()
    {
        petControls_input.Pet.Move.performed += ctx => ClickToMove();
    }

    void ClickToMove()
    {
        if (!networkObject.isOwner || tacticianState.jTacticianState.hp <= 0)
        {
            return;
        }
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 100, layerMaskTerrain))
        {
            navMeshAgent.destination = hit.point;
            isIdle = false;
            //navMeshAgent.SetDestination(hit.point);
            if (clickEffect != null)
            {
                //Instantiate(particle_clickEffect, hit.point += new Vector3(0, 0.1f, 0), particle_clickEffect.transform.rotation);
                clickEffect.gameObject.SetActive(true);
                clickEffect.transform.position = hit.point;
                var particle = clickEffect.main;
                particle.startLifetime = 0.5f;
                clickEffect.Play();
            }
        }
    }

    private void FaceToTarget()
    {
        if (Vector3.Distance(navMeshAgent.destination, this.transform.position) == 0 && !isIdle)
        {
            isIdle = true;
            SocketIO1.instance.tacticianMoveIO.Emit_TacticianStop();
            return;
        }
        if (navMeshAgent.velocity != Vector3.zero)
        {
            //Vector3 direction = (navMeshAgent.destination - transform.position).normalized;
            //Quaternion lookRotation = Quaternion.LookRotation(new Vector3(direction.x, 0, direction.z));
            //this.transform.rotation = Quaternion.Slerp(transform.rotation, lookRotation, Time.deltaTime * 10f);
            this.transform.rotation = Quaternion.LookRotation(navMeshAgent.velocity);
            SocketIO1.instance.tacticianMoveIO.Emit_TacticianMove(this.transform.position);
            SocketIO1.instance.tacticianMoveIO.Emit_TacticianRotate(this.transform.rotation);
        }
    }

    public void SetTacticianAway(Vector3 arenaPosition)
    {
        navMeshAgent.enabled = false;
        this.transform.position = new Vector3(arenaPosition.x + 10, this.transform.position.y, arenaPosition.z + 6);
        navMeshAgent.enabled = true;
    }

    public void SetTacticianHome(Vector3 arenaPosition)
    {
        navMeshAgent.enabled = false;
        this.transform.position = new Vector3(arenaPosition.x - 10, this.transform.position.y, arenaPosition.z - 9);
        navMeshAgent.enabled = true;
    }
}
