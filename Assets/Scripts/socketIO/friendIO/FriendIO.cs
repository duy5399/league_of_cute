using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class FriendIO : MonoBehaviour
{
    private void Start()
    {
        FriendIOStart();
    }

    #region On (lắng nghe sự kiện)
    public void FriendIOStart()
    {
        //Lấy danh sách bạn bè thành công
        SocketIO1.instance.socketManager.Socket.On<string>("get_friend_list_success", (_friendList) => {
            Debug.Log("get_friend_list_success: " + _friendList);
            List<JPlayerInfo> friendList = JsonConvert.DeserializeObject<List<JPlayerInfo>>(_friendList);
            //Duyệt qua từng thông tin người chơi và hiển thị nó
            foreach (JPlayerInfo friendInfo in friendList)
            {
                FriendListManager.instance.AddFriendList(friendInfo);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("get_friend_list_failure", (failure) => {
            Debug.Log("get_friend_list_failure: " + failure);
        });

        //Lấy danh sách lời mời kết bạn đã gửi thành công
        SocketIO1.instance.socketManager.Socket.On<string>("get_sent_friend_requests_success", (_requestList) => {
            Debug.Log("get_sent_friend_requests_success: " + _requestList);
            List<JPlayerInfo> requestList = JsonConvert.DeserializeObject<List<JPlayerInfo>>(_requestList);
            //Duyệt qua từng lời mời kết bạn đã gửi và hiển thị nó
            foreach (JPlayerInfo requestInfo in requestList)
            {
                AddFriendManager.instance.AddSentFriendRequest(requestInfo);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("get_sent_friend_request_failure", (failure) => {
            Debug.Log("get_sent_friend_request_failure: " + failure);
        });

        //Lấy danh sách yêu cầu kết bạn nhận được
        SocketIO1.instance.socketManager.Socket.On<string>("get_friend_requests_success", (_requestList) => {
            Debug.Log("get_friend_requests_success: " + _requestList);
            List<JPlayerInfo> requestList = JsonConvert.DeserializeObject<List<JPlayerInfo>>(_requestList);
            //Duyệt qua từng yêu cầu kết bạn nhận được và hiển thị nó
            foreach (JPlayerInfo requestInfo in requestList)
            {
                FriendRequestsManager.instance.AddFriendRequest(requestInfo);
            }
        });

        SocketIO1.instance.socketManager.Socket.On<string>("get_friend_requests_failure", (failure) => {
            Debug.Log("get_friend_requests_failure: " + failure);
        });

        //Gửi yêu cầu kết bạn thành công
        SocketIO1.instance.socketManager.Socket.On<string>("send_friend_request_success", (_requestInfo) => {
            AddFriendManager.instance.txtAlert.text = "Gửi yêu cầu kết bạn thành công";
            JPlayerInfo requestInfo = JsonConvert.DeserializeObject<JPlayerInfo>(_requestInfo);
            //Khi gửi cầu kết bạn thành công thì cập nhật và hiển thị nó
            AddFriendManager.instance.AddSentFriendRequest(requestInfo);
        });

        //Gửi yêu cầu kết bạn thất bại
        SocketIO1.instance.socketManager.Socket.On<string>("send_friend_request_failure", (failure) => {
            Debug.Log(failure);
            AddFriendManager.instance.txtAlert.text = failure;
        });
    }
    #endregion

    #region Emit (gửi sự kiện)
    public void Emit_GetFriendList()
    {
        SocketIO1.instance.socketManager.Socket.Emit("get_friend_list");
    }

    public void Emit_GetSentRequests()
    {
        SocketIO1.instance.socketManager.Socket.Emit("get_sent_friend_requests");
    }

    public void Emit_SendFriendRequest(string nickname)
    {
        SocketIO1.instance.socketManager.Socket.Emit("send_friend_request", nickname);
    }

    public void Emit_GetFriendRequests()
    {
        SocketIO1.instance.socketManager.Socket.Emit("get_friend_requests");
    }
    #endregion
}
