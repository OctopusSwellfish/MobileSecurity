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
import android.widget.EditText;
import android.widget.ListView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Vector;

public class SearchActivity extends AppCompatActivity {
    private static final String tag = "SearchActivity";
    EditText editText;

    ListView list;
    Crypto crypto = new Crypto();
    Vector<String> names = new Vector<>();
    Vector<String> ingredients = new Vector<>();
    Vector<String> periods = new Vector<>();
    Vector<String> effects = new Vector<>();
    Vector<String> cautions = new Vector<>();
    Vector<String> companies = new Vector<>();
    int pos = 0;
    String Id;
    CustomList adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        editText = (EditText)findViewById(R.id.edit_search);
        Intent intent = getIntent();
        Id = intent.getStringExtra("ID");
         adapter = new CustomList(SearchActivity.this);
        list = (ListView)findViewById(R.id.list_search);
        list.setAdapter(adapter);
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
                       ConnectSearch connectNetwork = new ConnectSearch("http://54.180.39.228:3000/mypage/addMedicine", values);
                       connectNetwork.execute();
                       return true;
                   }
               });
               popup.show();
           }
       });
    }

    public void onClickNameSearch(View view)
    {
        names.clear();
        ingredients.clear();
        periods.clear();
        effects.clear();
        cautions.clear();
        companies.clear();
        ContentValues values = new ContentValues();
        values.put("SearchMedicine",crypto.encrypt(editText.getText().toString(),"myVeryTopSecretK"));
        values.put("MAC_SearchMedicine",crypto.hmacSha1(crypto.encrypt(editText.getText().toString(),"myVeryTopSecretK"),"myVeryTopSecretK").replaceAll("\n",""));
        ConnectSearch connectNetwork = new ConnectSearch("http://54.180.39.228:3000/mypage/search", values);
        connectNetwork.execute();
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
    class ConnectSearch extends AsyncTask<Void, Void, JSONObject> {

        String url;
        ContentValues values;

        ConnectSearch(String url, ContentValues values){
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
            if(crypto.hmacSha1(result1.optString("SearchMedicine"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_SearchMedicine"))
            || crypto.hmacSha1(result1.optString("AddMedicine"),"myVeryTopSecretK").replaceAll("\n","").equals(result1.optString("MAC_AddMedicine"))
            ) {
                if (crypto.decrypt(result1.optString("SearchMedicine"), "myVeryTopSecretK").equals("Success")) {
                    JSONArray jsonArray = null;
                    try {
                        String s = crypto.decrypt(result1.optString("Search_medi_list"), "myVeryTopSecretK");
                        jsonArray = new JSONArray(s);
                    } catch (JSONException e) {
                        Log.d(tag,"JSON 오류");
                    }
                    try {
                        JSONArray jsonArray1 = new JSONArray(jsonArray.toString());
                        for (int i = 0; i < jsonArray1.length(); i++) {
                            try {
                                JSONObject jsonObject = jsonArray1.getJSONObject(i);

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
                        adapter.notifyDataSetChanged();
                    } catch (JSONException e) {
                        Log.d(tag,"JSON 오류");

                    }
                } else if (crypto.decrypt(result1.optString("AddMedicine"), "myVeryTopSecretK").equals("Success")) {

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
}
