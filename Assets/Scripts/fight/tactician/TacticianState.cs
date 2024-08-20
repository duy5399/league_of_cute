using UnityEngine;
using UnityEngine.AI;

public class TacticianState : MonoBehaviour
{
    public JTacticianState jTacticianState;

    public GameObject myBoom;
    public GameObject posAttack;

    private void Awake()
    {
        posAttack = this.transform.GetChild(2).gameObject;
    }
    private void Start()
    {
        
    }

    private void OnTriggerEnter(Collider other)
    {
        ItemBase1 itemBase = other.GetComponent<ItemBase1>();
        if (!itemBase || itemBase.picked)
        {
            return;
        }
        Debug.Log("Pickup Item: " + itemBase.jItemBase);
        SocketIO1.instance.itemIO.Emit_PickUpItem(itemBase.jItemBase);
    }

    public void DealDamage(GameObject target, int damage)
    {
        Debug.Log("DealDamage: ");
        GameObject boom = Instantiate(myBoom, posAttack.transform.position, posAttack.transform.rotation);
        boom.GetComponent<ProjectileMover>().target = target;
        boom.GetComponent<ProjectileMover>().isActive = true;
    }

    public void TakeDamage(int damage)
    {
        Debug.Log("TakeDamage: ");
        //animator.SetTrigger("Damage");
        //petHealthBar.SetDamagePopup(damage);
    }
}
