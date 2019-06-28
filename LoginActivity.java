package com.example.mobilesecurity;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.GlideDrawableImageViewTarget;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Vector;

public class LoginActivity extends AppCompatActivity {
    private static final String tag = "LoginActivity";
    ListView list;
    static final int GET_STRING = 1;
    static final int GET_NAME = 2;
    Vector<String> names = new Vector<>();
    Vector<String> ingredients = new Vector<>();
    Vector<String> periods = new Vector<>();
    Vector<String> effects = new Vector<>();
    Vector<String> cautions = new Vector<>();
    Vector<String> companies = new Vector<>();
    String Id;
    TextView textName;
    String name;
    CustomList adapter;
    String password;
    Crypto crypto = new Crypto();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_layout);
        ImageView iv = (ImageView)findViewById(R.id.iv);

        GlideDrawableImageViewTarget imageViewTarget = new GlideDrawableImageViewTarget(iv);
        Glide.with(this).load(R.drawable.cat_refresh).into(iv);
        textName = (TextView)findViewById(R.id.text_name);
        adapter = new CustomList(LoginActivity.this);
        list = (ListView)findViewById(R.id.list1);
        list.setAdapter(adapter);
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, final int position, long id) {
                PopupMenu popup = new PopupMenu(getApplicationContext(),view);
                popup.getMenuInflater().inflate(R.menu.user_popup,popup.getMenu());

                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        ContentValues values = new ContentValues();
                        values.put("DeleteMedicine",crypto.encrypt(names.get(position),"myVeryTopSecretK"));
                        values.put("MAC_DeleteMedicine",crypto.hmacSha1(crypto.encrypt(names.get(position),"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("ID",crypto.encrypt(Id,"myVeryTopSecretK"));
                        values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(Id,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        ConnectUserLogin connectNetwork = new ConnectUserLogin("http://54.180.39.228:3000/mypage/deleteMedicine", values);
                        connectNetwork.execute();
                        names.remove(position);
                        ingredients.remove(position);
                        periods.remove(position);
                        effects.remove(position);
                        cautions.remove(position);
                        companies.remove(position);
                        return true;
                    }
                });
                popup.show();
            }
        });
        Intent intent = getIntent();
        password = intent.getStringExtra("Password");
        if(intent.hasExtra("json"))
        {
            try {
                JSONArray jsonArray = new JSONArray(intent.getStringExtra("json"));

                for(int i=0;i<jsonArray.length();i++)
                {
                    try {
                        JSONObject jsonObject = jsonArray.getJSONObject(i);

                        names.add(jsonObject.optString("name"));
                        ingredients.add(jsonObject.optString("ingredient"));
                        periods.add(jsonObject.optString("period"));
                        effects.add(jsonObject.optString("effect"));
                        cautions.add(jsonObject.optString("caution"));
                        companies.add(jsonObject.optString("company"));

                    } catch (JSONException e) {
                        Log.d(tag,"JSON 오류");
                    }
                }
            }catch (JSONException e) {  Log.d(tag,"JSON 오류");}
        }
        Id = intent.getStringExtra("ID");
        name = intent.getStringExtra("NAME");
        textName.setText(name + "님");
    }

    public void onClickLogin(View button) {
        switch (button.getId())
        {
            case R.id.button_all_search:
                ContentValues values = new ContentValues();
                values.put("AllMedicine",crypto.encrypt("AllMedicine","myVeryTopSecretK"));
                values.put("MAC_AllMedicine",crypto.hmacSha1(crypto.encrypt("AllMedicine","myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                ConnectUserLogin connectNetwork = new ConnectUserLogin("http://54.180.39.228:3000/mypage/showAllmedicine", values);
                connectNetwork.execute();
                break;
            case R.id.button_logout:
                Toast.makeText(getApplicationContext(),"로그아웃 되었습니다.",Toast.LENGTH_SHORT).show();
                Intent intent_first = new Intent();
                setResult(RESULT_OK,intent_first);
                finish();
                break;
            case R.id.button_myPage:
                Intent intent = new Intent(LoginActivity.this,MyPageActivity.class);
                intent.putExtra("NAME",name);
                intent.putExtra("ID",Id);
                intent.putExtra("Password",password);
                startActivityForResult(intent,GET_NAME);
                break;
                default:
                    return;
        }
    }

    public class CustomList extends ArrayAdapter<String>
    {
        private final Activity context;
        public CustomList(Activity context)
        {
            super(context,R.layout.listitem,names);
            this.context = context;
        }
        @Override
        public View getView(int position, View view, ViewGroup parent)
        {
            LayoutInflater inflater = context.getLayoutInflater();
            View rowView = inflater.inflate(R.layout.listitem,null,true);
            TextView name = (TextView)rowView.findViewById(R.id.medicine_name);
            TextView ingredient = (TextView)rowView.findViewById(R.id.medicine_ingredient);
            TextView period = (TextView)rowView.findViewById(R.id.medicine_period);
            TextView effect = (TextView)rowView.findViewById(R.id.medicine_effect);
            TextView caution = (TextView)rowView.findViewById(R.id.medicine_caution);
            TextView company = (TextView)rowView.findViewById(R.id.medicine_company);

            name.setText(names.get(position));
            ingredient.append(ingredients.get(position));
            period.append(periods.get(position));
            effect.append(effects.get(position));
            caution.append(cautions.get(position));
            company.append(companies.get(position));

            return rowView;
        }
    }
    class ConnectUserLogin extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectUserLogin(String url, ContentValues values){
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
            if((crypto.hmacSha1(result1.optString("AllMedicine"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_AllMedicine"))
            && crypto.hmacSha1(result1.optString("All_medi_list"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_All_medi_list")))
            || crypto.hmacSha1(result1.optString("Delete"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_Delete"))
            ) {
                if (crypto.decrypt(result1.optString("AllMedicine"), "myVeryTopSecretK").equals("Success")) {
                    Intent intent = new Intent(LoginActivity.this, TotalMedicineActivity.class);
                    JSONArray jsonArray = null;
                    String s = crypto.decrypt(result1.optString("All_medi_list"), "myVeryTopSecretK");
                    try {
                        jsonArray = new JSONArray(s);
                    } catch (JSONException e) {
                        Log.d(tag,"JSON 오류");
                    }
                    intent.putExtra("All_json", jsonArray.toString());
                    intent.putExtra("ID", Id);
                    startActivityForResult(intent, GET_STRING);
                } else if (crypto.decrypt(result1.optString("Delete"), "myVeryTopSecretK").equals("Success")) {
                    adapter.notifyDataSetChanged();
                    Toast.makeText(getApplicationContext(), "삭제 성공", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode,int resultCode,Intent data)
    {
        if(requestCode == GET_STRING)
        {
            if(resultCode == RESULT_OK)
            {
                    names.add(data.getStringExtra("medicine_name"));
                    ingredients.add(data.getStringExtra("medicine_ingredient"));
                    periods.add(data.getStringExtra("medicine_period"));
                    effects.add(data.getStringExtra("medicine_effect"));
                    cautions.add(data.getStringExtra("medicine_caution"));
                    companies.add(data.getStringExtra("medicine_company"));
                    adapter.notifyDataSetChanged();
            }
        } else if(requestCode == GET_NAME)
        {
            if(resultCode == RESULT_OK)
            {
                name = data.getStringExtra("NEW_NAME");
                password = data.getStringExtra("NEW_PASSWORD");
                textName.setText(name+"님");
            }
        }
    }


}
