package com.example.mobilesecurity;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Vector;

public class TotalMedicineActivity extends AppCompatActivity {
    private static final String tag = "TotalMedicineActivity";
    static final int GET_VALUE = 1;
    ListView list;
    String Id;
    Vector<String> names = new Vector<>();
    Vector<String> ingredients = new Vector<>();
    Vector<String> periods = new Vector<>();
    Vector<String> effects = new Vector<>();
    Vector<String> cautions = new Vector<>();
    Vector<String> companies = new Vector<>();
    int pos = 0;
    Crypto crypto = new Crypto();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.total_medicine_layout);

        CustomList adapter = new CustomList(TotalMedicineActivity.this);
        list = (ListView)findViewById(R.id.list_total);
        list.setAdapter(adapter);
        Intent intent = getIntent();
        Id = intent.getStringExtra("ID");
        if(intent.hasExtra("All_json"))
        {
            try {
                JSONArray jsonArray = new JSONArray(intent.getStringExtra("All_json"));

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

                    } catch (JSONException e) {  Log.d(tag,"JSON 오류");}

                }

            }catch (JSONException e) {  Log.d(tag,"JSON 오류");}
        }
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, final int position, long id) {
                PopupMenu popup = new PopupMenu(getApplicationContext(),view);
                popup.getMenuInflater().inflate(R.menu.total_popup,popup.getMenu());

                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        ContentValues values = new ContentValues();
                        values.put("AddMedicine",crypto.encrypt(names.get(position),"myVeryTopSecretK"));
                        values.put("MAC_AddMedicine",crypto.hmacSha1(crypto.encrypt(names.get(position),"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        values.put("ID",crypto.encrypt(Id,"myVeryTopSecretK"));
                        values.put("MAC_ID",crypto.hmacSha1(crypto.encrypt(Id,"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
                        pos = position;
                        ConnectAdd connectNetwork = new ConnectAdd("http://54.180.39.228:3000/mypage/addMedicine", values);
                        connectNetwork.execute();
                        return true;
                    }
                });
                popup.show();
            }
        });
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
    public void onClickSearch(View view)
    {
        Intent intent = new Intent(TotalMedicineActivity.this,SearchActivity.class);
        intent.putExtra("ID",Id);
        startActivityForResult(intent,GET_VALUE);
    }

    class ConnectAdd extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectAdd(String url, ContentValues values){
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
            if(crypto.hmacSha1(result1.optString("AddMedicine"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_AddMedicine"))) {
                if (crypto.decrypt(result1.optString("AddMedicine"), "myVeryTopSecretK").equals("Success")) {
                    Intent intent = new Intent();
                    intent.putExtra("medicine_name", names.get(pos));
                    intent.putExtra("medicine_ingredient", ingredients.get(pos));
                    intent.putExtra("medicine_period", periods.get(pos));
                    intent.putExtra("medicine_effect", effects.get(pos));
                    intent.putExtra("medicine_caution", cautions.get(pos));
                    intent.putExtra("medicine_company", companies.get(pos));
                    setResult(RESULT_OK, intent);
                    Toast.makeText(getApplicationContext(), "등록 성공", Toast.LENGTH_SHORT).show();

                } else if (crypto.decrypt(result1.optString("AddMedicine"), "myVeryTopSecretK").equals("Fail")) {
                    Toast.makeText(getApplicationContext(), "약이 중복됩니다.", Toast.LENGTH_SHORT).show();
                }
            }

        }
    }
    @Override
    protected void onActivityResult(int requestCode,int resultCode,Intent data)
    {
        if(requestCode == GET_VALUE)
        {
            if(resultCode == RESULT_OK)
            {
                Intent intent = new Intent();
                intent.putExtra("medicine_name",data.getStringExtra("medicine_name"));
                intent.putExtra("medicine_ingredient",data.getStringExtra("medicine_ingredient"));
                intent.putExtra("medicine_period",data.getStringExtra("medicine_period"));
                intent.putExtra("medicine_effect",data.getStringExtra("medicine_effect"));
                intent.putExtra("medicine_caution",data.getStringExtra("medicine_caution"));
                intent.putExtra("medicine_company",data.getStringExtra("medicine_company"));
                setResult(RESULT_OK,intent);
            }
        }
    }
}
