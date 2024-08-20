Shader "Shader Forge/testHeatDistortion" {
Properties {
 _shrink ("shrink", Range(1,50)) = 1
 _strength ("strength", Range(0,1)) = 1
 _distortion ("distortion", 2D) = "white" {}
 _sideColor ("sideColor", Color) = (0.5,0.5,0.5,1)
 _colorshrink ("color shrink", Range(0,2)) = 1
 _node_173 ("node_173", Float) = 1
}
	//DummyShaderTextExporter
	
	SubShader{
		Tags { "RenderType" = "Opaque" }
		LOD 200
		CGPROGRAM
#pragma surface surf Standard fullforwardshadows
#pragma target 3.0
		sampler2D _MainTex;
		struct Input
		{
			float2 uv_MainTex;
		};
		void surf(Input IN, inout SurfaceOutputStandard o)
		{
			fixed4 c = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = c.rgb;
		}
		ENDCG
	}
}