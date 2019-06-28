package com.example.mobilesecurity;

import android.app.AlertDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    private static final String tag = "MainActivity";
    EditText editId,editPassword;
    String sId,sPassword;
    static final int GET_LOGIN = 1;
    static final int GET_SIGNUP = 2;
    Crypto crypto = new Crypto();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        editId = (EditText)findViewById(R.id.edit_id);
        editPassword = (EditText)findViewById(R.id.edit_password);

    }

    public void onClick(View button)
    {
        byte[] b=null;
        byte[] iv = null;
        switch (button.getId())
        {
            case R.id.button_login:
                ContentValues values = new ContentValues();
                sId = editId.getText().toString();
                sPassword = editPassword.getText().toString();

                values.put("ID", crypto.encrypt(sId,"myVeryTopSecretK"));
                values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(sId,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));

                values.put("Password",crypto.encrypt(sPassword,"myVeryTopSecretK"));
               values.put("MAC_Password",crypto.hmacSha1(crypto.encrypt(sPassword,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));

                ConnectLogin connectNetwork = new ConnectLogin("http://54.180.39.228:3000/login", values);
                connectNetwork.execute();
                break;
            case R.id.button_sign_up:
                Intent intent2 = new Intent(MainActivity.this,SignUpActivity.class);
                startActivityForResult(intent2,GET_SIGNUP);
                break;
                default:
                    return;
        }
    }
    class ConnectLogin extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectLogin(String url, ContentValues values){
            this.url = url;
            this.values = values;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            //progress bar를 보여주는 등등의 행위

        }

        @Override
        protected JSONObject doInBackground(Void... params) {
            JSONObject jsonObject = null;
            RequestHttpURLConnection requestHttpURLConnection = new RequestHttpURLConnection();

            try {
               jsonObject = new JSONObject(requestHttpURLConnection.request(this.url, values));

            } catch (JSONException e) {  Log.d(tag,"JSON 오류");}

          return jsonObject;

            // 결과가 여기에 담깁니다. 아래 onPostExecute()의 파라미터로 전달됩니다.
        }

        @Override
        protected void onPostExecute(JSONObject result1) {
            // 통신이 완료되면 호출됩니다.
            // 결과에 따른 UI 수정 등은 여기서 합니다.
            JSONArray mArray = null;
            AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MainActivity.this);

            if(crypto.hmacSha1(result1.optString("login"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_login"))
            && crypto.hmacSha1(result1.optString("username"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_username"))
            && crypto.hmacSha1(result1.optString("medi_list"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_medi_list"))
            ) {
                if (crypto.decrypt(result1.optString("login"), "myVeryTopSecretK").equals("Success")) {
                    Intent intent1 = new Intent(MainActivity.this, LoginActivity.class);
                    intent1.putExtra("ID", sId);
                    intent1.putExtra("NAME", crypto.decrypt(result1.optString("username"),"myVeryTopSecretK"));
                    intent1.putExtra("Password", sPassword);

                    String s = crypto.decrypt(result1.optString("medi_list"), "myVeryTopSecretK");
                    try {
                        mArray = new JSONArray(s);
                    } catch (JSONException e) {
                        Log.d(tag,"JSON 오류");
                    }

                    intent1.putExtra("json", mArray.toString());

                    setResult(RESULT_OK, intent1);
                    startActivityForResult(intent1, GET_LOGIN);
                }
            } else {
                    alertBuilder
                            .setTitle("알림")
                            .setMessage("로그인에 실패하였습니다. ")
                            .setCancelable(true)
                            .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    Log.d(tag,"alert 누름");
                                }
                            });
                    AlertDialog dialog = alertBuilder.create();
                    dialog.show();

                }

        }
    }
    @Override
    protected void onActivityResult(int requestCode,int resultCode, Intent data)
    {
        if(requestCode == GET_LOGIN)
        {
            if(resultCode == RESULT_OK)
            {
                editId.setText("");
                editPassword.setText("");
            }
        }
        if(requestCode == GET_SIGNUP)
        {
            if(resultCode == RESULT_OK)
            {
                editId.setText("");
                editPassword.setText("");
            }
        }
    }

}

