package com.example.mobilesecurity;

import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.Mac;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

public class Crypto  {
    private static final String tag = "Crypto";
    public  String encrypt(String text,String key)
    {
        try {
        byte[] keyBytes = new byte[16];
        byte[] b = key.getBytes("UTF-8");
        int len = b.length;
        if(len > keyBytes.length)
            len = keyBytes.length;
        System.arraycopy(b,0,keyBytes,0,len);
        Charset charset = Charset.forName("UTF-8");

        SecretKeySpec sks = new SecretKeySpec(keyBytes,"AES");
        Cipher cipher;
        byte[] encryptedData = null;

            cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE,sks);
            encryptedData = cipher.doFinal(text.getBytes(charset));

            return  Base64.encodeToString(encryptedData,0);

        } catch (NoSuchAlgorithmException e) {
            Log.d(tag,"알고리즘 오류");
        }
        catch (InvalidKeyException e) {  Log.d(tag,"키 오류"); }
        catch (NoSuchPaddingException e) {  Log.d(tag,"페딩 오류"); }
        catch (IllegalBlockSizeException e) {  Log.d(tag,"블록사이즈 오류"); }
        catch (BadPaddingException e) {  Log.d(tag,"나쁜패딩 오류"); }
        catch (UnsupportedEncodingException e) {  Log.d(tag,"인코딩 오류"); }
        return null;
    }
    public String decrypt(String text,String key)
    {
        byte[] results = null;
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            byte[] keyBytes = new byte[16];
            byte[] b = key.getBytes("UTF-8");
            int len = b.length;
            if(len > keyBytes.length)
                len = keyBytes.length;
            System.arraycopy(b,0,keyBytes,0,len);
            SecretKeySpec keySpec = new SecretKeySpec(keyBytes,"AES");
            cipher.init(Cipher.DECRYPT_MODE,keySpec);

            results = cipher.doFinal(Base64.decode(text,0));
            return new String(results,"UTF-8");
        }catch (NoSuchAlgorithmException e) { Log.d(tag,"알고리즘 오류"); }
        catch (InvalidKeyException e) {  Log.d(tag,"키 오류");}
        catch (NoSuchPaddingException e) {Log.d(tag,"페딩 오류"); }
        catch (IllegalBlockSizeException e) {Log.d(tag,"블록사이즈 오류"); }
        catch (BadPaddingException e) { Log.d(tag,"나쁜패딩 오류");}
        catch (UnsupportedEncodingException e) { Log.d(tag,"인코딩 오류");}
       return null;
    }

  public String hmacSha1(String value,String key)
  {
      try {
          Mac mac = Mac.getInstance("HmacSHA256");
          SecretKeySpec secret = new SecretKeySpec(key.getBytes("UTF-8"),"HmacSHA256");
          mac.init(secret);
          byte[] bytes = mac.doFinal(value.getBytes("UTF-8"));

          String hash = Base64.encodeToString(bytes,Base64.DEFAULT);
          return hash;
      } catch (NoSuchAlgorithmException e)
      {
          Log.d(tag,"알고리즘 오류");
      } catch (InvalidKeyException e)
      {
          Log.d(tag,"키 오류");
      }catch (UnsupportedEncodingException e)
      {
          Log.d(tag,"인코딩 오류");
      }

      return null;

  }

}
