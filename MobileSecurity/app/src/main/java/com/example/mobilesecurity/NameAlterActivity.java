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

import org.json.JSONException;
import org.json.JSONObject;

public class NameAlterActivity extends AppCompatActivity {
    private static final String tag = "NameAlterActivity";
    EditText editText;
    String Id;
    Crypto crypto = new Crypto();
    String new_name;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.name_alter_layout);
        editText = (EditText)findViewById(R.id.edit_alter_name);
        Intent intent = getIntent();
        Id = intent.getStringExtra("ID");
    }

    public void onClickNameAlter(View view)
    {

        AlertDialog.Builder alertBuilder = new AlertDialog.Builder(NameAlterActivity.this);

        alertBuilder
                .setTitle("변경")
                .setMessage(editText.getText().toString() + "(으)로 변경하시겠습니까? ")
                .setCancelable(true)
                .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        new_name = editText.getText().toString();
                        ContentValues values = new ContentValues();
                        values.put("AlterName",crypto.encrypt(new_name,"myVeryTopSecretK"));
                        values.put("MAC_AlterName",crypto.hmacSha1(crypto.encrypt(new_name,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("ID",crypto.encrypt(Id,"myVeryTopSecretK"));
                        values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(Id,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        ConnectNameAlter connectNetwork = new ConnectNameAlter("http://54.180.39.228:3000/mypage/changeName", values);
                        connectNetwork.execute();

                    }
                })
                .setNegativeButton("취소", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.d(tag,"alert 누름");
                    }
                });

        AlertDialog dialog = alertBuilder.create();
        dialog.show();
    }
    class ConnectNameAlter extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectNameAlter(String url, ContentValues values){
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
            RequestHttpURLConnection requestHttpURLConnection = new RequestHttpURLConnection();
            JSONObject jsonObject = null;
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
            if(crypto.hmacSha1(result1.optString("ModifyName"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_ModifyName"))) {
                if (crypto.decrypt(result1.optString("ModifyName"), "myVeryTopSecretK").equals("Success")) {
                    Intent intent = new Intent();
                    intent.putExtra("NEWNAME", new_name);
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        }
    }
}
