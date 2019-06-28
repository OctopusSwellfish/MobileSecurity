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
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

public class SignUpActivity extends AppCompatActivity {
    private static final String tag = "SignUpActivity";
    EditText editId,editPassword,editName,editAge,editPasswordCheck;
    String sId,sPassword,sName,sAge,sPasswordCheck;
    String sSex = "남자";
    ContentValues values;
    Crypto crypto = new Crypto();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.sign_up_layout);

        editId = (EditText)findViewById(R.id.edit_sign_up_id);
        editPassword = (EditText)findViewById(R.id.edit_sign_up_password1);
        editName = (EditText)findViewById(R.id.edit_sign_up_name);
        editAge = (EditText)findViewById(R.id.edit_sign_up_age);
        editPasswordCheck = (EditText)findViewById(R.id.edit_sign_up_password2);

        Spinner spinner = (Spinner)findViewById(R.id.spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,R.array.age_array,
                android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                sSex= parent.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                Log.d(tag,"아무것도 선택 안함");
            }
        });

        Button button_overlap = (Button)findViewById(R.id.button_overlap);
        button_overlap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sId = editId.getText().toString();
                values = new ContentValues();
                values.put("ID",crypto.encrypt(sId,"myVeryTopSecretK"));
                values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(sId,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                ConnectRegister connectNetwork = new ConnectRegister("http://54.180.39.228:3000/register/check", values);
                connectNetwork.execute();

            }
        });
    }

    public void onClick(View button)
    {
        sId = editId.getText().toString();
        sPassword = editPassword.getText().toString();
        sAge = editAge.getText().toString();
        sName = editName.getText().toString();
        sPasswordCheck = editPasswordCheck.getText().toString();
        switch (button.getId())
        {
            case R.id.button_sign_up_ok:
                values = new ContentValues();
                if(sId.equals(""))
                {
                    Toast.makeText(SignUpActivity.this,"아이디를 입력하세요.",Toast.LENGTH_SHORT).show();
                    break;
                }
                if(sPassword.equals(""))
                {
                    Toast.makeText(SignUpActivity.this,"비밀번호를 입력하세요.",Toast.LENGTH_SHORT).show();
                    break;
                }
                if(sPasswordCheck.equals(""))
                {
                    Toast.makeText(SignUpActivity.this,"비밀번호 확인을 입력하세요.",Toast.LENGTH_SHORT).show();
                    break;
                }
                if(sName.equals(""))
                {
                    Toast.makeText(SignUpActivity.this,"이름을 입력하세요.",Toast.LENGTH_SHORT).show();
                    break;
                }
                if(sAge.equals("")) {
                    Toast.makeText(SignUpActivity.this, "나이를 입력하세요.", Toast.LENGTH_SHORT).show();
                    break;
                }

                    if(sPassword.equals(sPasswordCheck))
                    {
                        values.put("ID", crypto.encrypt(sId,"myVeryTopSecretK"));
                        values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(sId,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("Password", crypto.encrypt(sPassword,"myVeryTopSecretK"));
                        values.put("MAC_Password",crypto.hmacSha1(crypto.encrypt(sPassword,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("Age",crypto.encrypt(sAge,"myVeryTopSecretK"));
                        values.put("MAC_Age",crypto.hmacSha1(crypto.encrypt(sAge,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("Name",crypto.encrypt(sName,"myVeryTopSecretK"));
                        values.put("MAC_Name",crypto.hmacSha1(crypto.encrypt(sName,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("Sex",crypto.encrypt(sSex,"myVeryTopSecretK"));
                        values.put("MAC_Sex",crypto.hmacSha1(crypto.encrypt(sSex,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        ConnectRegister connectNetwork = new ConnectRegister("http://54.180.39.228:3000/register", values);
                        connectNetwork.execute();

                    } else
                    {
                        Toast.makeText(getApplicationContext(),"비밀번호가 다릅니다.",Toast.LENGTH_SHORT).show();
                    }
                    break;
            case R.id.button_sign_up_cancel:
                Intent intent = new Intent();
                setResult(RESULT_OK,intent);
                Toast.makeText(getApplicationContext(),"회원가입 취소",Toast.LENGTH_SHORT).show();
                finish();
                break;
                default:
                    return;

        }
    }
    class ConnectRegister extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectRegister(String url, ContentValues values){
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
            AlertDialog.Builder alertBuilder = new AlertDialog.Builder(SignUpActivity.this);

          if(crypto.hmacSha1(result1.optString("register"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_register"))){
                if (crypto.decrypt(result1.optString("register"), "myVeryTopSecretK").equals("Success")) {
                    Intent intent = new Intent();
                    setResult(RESULT_OK, intent);
                    Toast.makeText(SignUpActivity.this, "회원가입 완료", Toast.LENGTH_SHORT).show();
                    finish();

                }   else  if (crypto.decrypt(result1.optString("register"), "myVeryTopSecretK").equals("Empty")) {
                    alertBuilder
                            .setTitle("알림")
                            .setMessage("아이디를 입력하세요! ")
                            .setCancelable(true)
                            .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    Log.d(tag,"alert 누름");
                                }
                            });
                    AlertDialog dialog = alertBuilder.create();
                    dialog.show();

                }   else if (crypto.decrypt(result1.optString("register"), "myVeryTopSecretK").equals("NotEmpty")) {
                    Toast.makeText(SignUpActivity.this, "사용 가능한 아이디입니다.", Toast.LENGTH_SHORT).show();
                } else {
                    alertBuilder
                            .setTitle("아이디 중복")
                            .setMessage("다른 아이디를 입력하세요 ")
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
    }
}
