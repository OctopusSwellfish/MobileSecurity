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
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class MyPageActivity extends AppCompatActivity {
    private static final String tag = "MyPageActivity";
    static final int GET_NAME = 1;
    TextView textView;
    String name;
    String Id;
    String password;
    EditText editText,editText1,editText2;
    Crypto crypto = new Crypto();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.my_page_layout);
        Intent intent = getIntent();
        Id = intent.getStringExtra("ID");
        name = intent.getStringExtra("NAME");
        password = intent.getStringExtra("Password");
        textView = (TextView)findViewById(R.id.text_mypage_name);
        editText = (EditText)findViewById(R.id.edit_now_password);
        editText1 = (EditText)findViewById(R.id.edit_new_password);
        editText2 = (EditText)findViewById(R.id.edit_new_password_check);
        textView.setText(name);
    }

    public void onClickMyPage(View view)
    {
        switch (view.getId())
        {
            case R.id.button_mypage_name:
                final Intent intent = new Intent(MyPageActivity.this,NameAlterActivity.class);
                intent.putExtra("ID",Id);
                startActivityForResult(intent,GET_NAME);
                break;
            case R.id.button_mypage_ok:
                if(!(editText.getText().toString().equals(password)))
                {
                    Toast.makeText(getApplicationContext(),"현재 비밀번호가 틀렸습니다.",Toast.LENGTH_SHORT).show();
                    break;
                }
                if(editText1.getText().toString().equals(editText2.getText().toString()))
                {
                    AlertDialog.Builder alertBuilder = new AlertDialog.Builder(MyPageActivity.this);
                    alertBuilder
                            .setTitle("알림")
                            .setMessage("비밀번호를 변경하시겠습니까? ")
                            .setCancelable(true)
                            .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    ContentValues values = new ContentValues();
                                    values.put("ID",crypto.encrypt(Id,"myVeryTopSecretK"));
                                    values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(Id,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                                    values.put("NewPassword",crypto.encrypt(editText1.getText().toString(),"myVeryTopSecretK"));
                                    values.put("MAC_NewPassword",crypto.hmacSha1(crypto.encrypt(editText1.getText().toString(),"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                                    ConnectMyPage connectNetwork = new ConnectMyPage("http://54.180.39.228:3000/mypage/changePassword", values);
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
                } else
                {
                    Toast.makeText(getApplicationContext(),"새로운 비밀번호가 같지 않습니다.",Toast.LENGTH_SHORT).show();
                }
                break;
            case R.id.button_mypage_cancel:
                finish();
                break;
                default:
                    return;

        }
    }
    @Override
    protected void onActivityResult(int requestCode,int resultCode,Intent data)
    {
        if(requestCode == GET_NAME)
        {
            if(resultCode==RESULT_OK)
            {
                textView.setText(data.getStringExtra("NEWNAME"));
                Intent intent = new Intent();
                intent.putExtra("NEW_NAME",textView.getText().toString());
                setResult(RESULT_OK,intent);
            }
        }
    }
    class ConnectMyPage extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectMyPage(String url, ContentValues values){
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
            if(crypto.hmacSha1(result1.optString("ModifyPassword"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_ModifyPassword"))) {
                if (crypto.decrypt(result1.optString("ModifyPassword"), "myVeryTopSecretK").equals("Success")) {
                    Toast.makeText(getApplicationContext(), "비밀번호 변경 성공", Toast.LENGTH_SHORT).show();
                    Intent intent1 = new Intent();
                    password = editText1.getText().toString();
                    intent1.putExtra("NEW_PASSWORD", editText1.getText().toString());
                    intent1.putExtra("NEW_NAME", textView.getText().toString());
                    setResult(RESULT_OK, intent1);
                    editText.setText("");
                    editText1.setText("");
                    editText2.setText("");
                }
            }

        }
    }
}
