using System;
using System.Collections.Generic;
using UnityEngine;

public class NativeSDK : MonoBehaviour
{
	public delegate void SingleCallBack(string results);

	public static NativeSDK _inst = null;

	public static bool rkInited = false;

	private static AndroidJavaClass NativeBridge = new AndroidJavaClass("com.giu.nativebridge.Bridge");

	private static string _android_id;

	private static string _bi_channel;

	public static bool payInitCalled = false;

	public SingleCallBack InitSuccess;

	public SingleCallBack InitFailed;

	public SingleCallBack LoginSuccess;

	public SingleCallBack LoginFailed;

	public SingleCallBack LeaveSDK;

	public SingleCallBack LogoutSuccess;

	public SingleCallBack LogoutFailed;

	public Action<string, string> applePaySuccess;

	public SingleCallBack applePayFailed;

	public SingleCallBack onStop;

	public SingleCallBack onResume;

	public SingleCallBack onPause;

	public SingleCallBack PayCallBack;

	public SingleCallBack rkExitSuccess;

	public SingleCallBack setTagsSuccess;

	public SingleCallBack setTagsFailed;

	private static AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");

	private static AndroidJavaObject plugin = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");

	public static NativeSDK Inst
	{
		get
		{
			if (null == _inst)
			{
				EnsureInst();
			}
			return _inst;
		}
	}

	public static void EnsureInst()
	{
		if (_inst == null)
		{
			GameObject gameObject = new GameObject();
			gameObject.name = "_NativeBridge";
			_inst = gameObject.AddComponent<NativeSDK>();
			UnityEngine.Object.DontDestroyOnLoad(gameObject);
		}
	}

	public static string getSig_(long rnd)
	{
		return NativeBridge.CallStatic<string>("getSig", new object[1] { rnd });
	}

	public static string GetChannel()
	{
		return NativeBridge.CallStatic<string>("getChannel", new object[0]);
	}

	public static string getAppleVersion_()
	{
		return string.Empty;
	}

	public static string getLogState_()
	{
		return string.Empty;
	}

	public static void rkInit_()
	{
		EnsureInst();
		if (!rkInited)
		{
			NativeBridge.CallStatic("rkInit");
		}
	}

	public static void rkLogin_()
	{
		EnsureInst();
		if (!rkInited)
		{
			rkInit_();
		}
		NativeBridge.CallStatic("rkLogin");
	}

	public static void rkLogout_()
	{
		EnsureInst();
		NativeBridge.CallStatic("rkLogout");
	}

	public static void rkExit()
	{
		EnsureInst();
		NativeBridge.CallStatic("rkExit");
	}

	public void onPauseCallBack(string results)
	{
		Debug.Log("onPause: " + results);
		safelistener(onPause, results);
	}

	public void onStopCallBack(string results)
	{
		Debug.Log("onStop: " + results);
		safelistener(onStop, results);
	}

	public void onResumeCallBack(string results)
	{
		Debug.Log("onResume: " + results);
		safelistener(onResume, results);
	}

	public void applePaySuccessCallBack(string results)
	{
		Debug.Log("applePaySuccessCallBack: " + results);
		string[] array = results.Split(new string[1] { "-|-" }, StringSplitOptions.None);
		string arg = string.Empty;
		if (array.Length > 1)
		{
			arg = array[1];
		}
		applePaySuccess(array[0], arg);
	}

	public void applePayFailedCallBack(string results)
	{
		Debug.Log("applePayFailedCallBack: " + results);
		safelistener(applePayFailed, results);
	}

	public static void applePay_(string product_id)
	{
	}

	public static void rkPay_(string order_id, string role_id, string role_name, string role_grade, string role_balance, string role_vip, string role_party, string server_name, string product_id, string product_name, float product_price, int product_count, string pay_description, string user_server, string ext_info)
	{
		EnsureInst();
		Debug.Log("NativeSDK rkPay_ params: " + order_id + "," + role_id + "," + role_name + "," + role_grade + "," + role_balance + "," + role_vip + "," + role_party + "," + server_name + "," + product_id + "," + product_name + "," + product_price + "," + product_count + "," + pay_description + "," + user_server + "," + ext_info);
		NativeBridge.CallStatic("rkPay", order_id, role_id, role_name, role_grade, role_balance, role_vip, role_party, server_name, product_id, product_name, product_price, product_count, pay_description, user_server, ext_info);
	}

	private void safelistener(SingleCallBack callback, string param)
	{
		if (callback != null)
		{
			callback(param);
		}
		else
		{
			Debug.Log("callback not assigned");
		}
	}

	public void rkInitSuccessCallBack(string results)
	{
		rkInited = true;
		Debug.Log("rkInitSuccessCallBack: " + results);
		safelistener(InitSuccess, results);
	}

	public void rkInitFailedCallBack(string results)
	{
		Debug.Log("rkInitFailedCallBack: " + results);
		safelistener(InitFailed, results);
	}

	public void rkLoginSuccessCallBack(string results)
	{
		Debug.Log("rkLoginSuccessCallBack: " + results);
		safelistener(LoginSuccess, results);
	}

	public void rkLoginFailedCallBack(string results)
	{
		Debug.Log("rkLoginFailedCallBack: " + results);
		safelistener(LoginFailed, results);
	}

	public void rkLeaveSDKCallBack(string results)
	{
		Debug.Log("rkLeaveSDKCallBack: " + results);
		safelistener(LeaveSDK, results);
	}

	public void rkLogoutSuccessCallBack(string results)
	{
		Debug.Log("rkLogoutSuccessCallBack: " + results);
		safelistener(LogoutSuccess, results);
	}

	public void rkLogoutFailedCallBack(string results)
	{
		Debug.Log("rkLogoutFailedCallBack: " + results);
		safelistener(LogoutFailed, results);
	}

	public void rkExitSuccessCallBack(string results)
	{
		Debug.Log("rkExitSuccessCallBack");
		safelistener(rkExitSuccess, results);
	}

	public void rkPayCallBack(string results)
	{
		Debug.Log("rkPayCallBack: " + results);
		safelistener(PayCallBack, results);
	}

	public void rkRoleCreate(string servername, string serverid, string userid, string username)
	{
		EnsureInst();
		NativeBridge.CallStatic("rkRoleCreate", servername + "," + serverid + "," + userid + "," + username);
	}

	public void rkRoleLogin(string servername, string serverid, string userid, string username, string level)
	{
		EnsureInst();
		NativeBridge.CallStatic("rkRoleLogin", servername + "," + serverid + "," + userid + "," + username + "," + level);
	}

	public void rkRoleUpgrade(string rolename, string level)
	{
		EnsureInst();
		NativeBridge.CallStatic("rkRoleUpgrade", rolename, level);
	}

	public static string GetDeviceInfo()
	{
		if (_android_id == null)
		{
			_android_id = NativeBridge.CallStatic<string>("getAndroidDeviceInfo", new object[0]);
		}
		return _android_id;
	}

	public static string GetAndroidID()
	{
		if (_android_id == null)
		{
			_android_id = NativeBridge.CallStatic<string>("getAndroidID", new object[0]);
		}
		return _android_id;
	}

	public static string GetBiChannel()
	{
		if (_bi_channel == null)
		{
			_bi_channel = NativeBridge.CallStatic<string>("getBiChannel", new object[0]);
		}
		return _bi_channel;
	}

	public static void setEngineTrue_()
	{
		Debug.Log("setEngineTrue_ only in ios");
	}

	public static void setEngineFalse_()
	{
		Debug.Log("setEngineFalse_ only in ios");
	}

	public static void applePayDone_(string receipt)
	{
		Debug.Log("setEngineFalse_ only in ios");
	}

	public static void registerPush(string appId, string appKey)
	{
		plugin.Call("registerPush", appId, appKey);
	}

	public static void unregisterPush()
	{
		plugin.Call("unregisterPush");
	}

	public static void setAlias(string alias)
	{
		plugin.Call("setAlias", alias, null);
	}

	public static void unsetAlias(string alias)
	{
		plugin.Call("unsetAlias", alias, null);
	}

	public static void subscribe(string topic)
	{
		plugin.Call("subscribe", topic, null);
	}

	public static void unsubscribe(string topic)
	{
		plugin.Call("unsubscribe", topic, null);
	}

	public static void pausePush()
	{
		plugin.Call("pausePush", null);
	}

	public static void resumePush()
	{
		plugin.Call("resumePush", null);
	}

	public static void setAcceptTime(int startHour, int startMin, int endHour, int endMin)
	{
		plugin.Call("setAcceptTime", startHour, startMin, endHour, endMin, null);
	}

	public static void reportMessageClicked(string msgid)
	{
		plugin.Call("reportMessageClicked", msgid);
	}

	public static void checkManifest()
	{
		plugin.Call("checkManifest");
	}

	public static void clearNotification()
	{
		plugin.Call("clearNotification");
	}

	public static void clearNotification(int notifyId)
	{
		plugin.Call("clearNotification", notifyId);
	}

	public static void setLocalNotificationType(int type)
	{
		plugin.Call("setLocalNotificationType", type);
	}

	public static void clearLocalNotificationType()
	{
		plugin.Call("clearLocalNotificationType");
	}

	public static string getRegId()
	{
		return plugin.Call<string>("getRegId", new object[0]);
	}

	public static List<string> getAllAlias()
	{
		AndroidJavaObject objects = plugin.Call<AndroidJavaObject>("getAllAlias", new object[0]);
		return convetToList(objects);
	}

	public static List<string> getAllTopic()
	{
		AndroidJavaObject objects = plugin.Call<AndroidJavaObject>("getAllTopic", new object[0]);
		return convetToList(objects);
	}

	private static List<string> convetToList(AndroidJavaObject objects)
	{
		List<string> list = new List<string>();
		IntPtr rawObject = objects.GetRawObject();
		IntPtr rawClass = objects.GetRawClass();
		IntPtr methodID = AndroidJNI.GetMethodID(rawClass, "get", "(I)Ljava/lang/Object;");
		IntPtr methodID2 = AndroidJNI.GetMethodID(rawClass, "size", "()I");
		jvalue[] args = new jvalue[1];
		int num = AndroidJNI.CallIntMethod(rawObject, methodID2, args);
		for (int i = 0; i < num; i++)
		{
			object[] args2 = new object[1] { i };
			jvalue[] array = AndroidJNIHelper.CreateJNIArgArray(args2);
			string item = AndroidJNI.CallStringMethod(rawObject, methodID, array);
			list.Add(item);
			AndroidJNIHelper.DeleteJNIArgArray(args2, array);
		}
		return list;
	}
}
