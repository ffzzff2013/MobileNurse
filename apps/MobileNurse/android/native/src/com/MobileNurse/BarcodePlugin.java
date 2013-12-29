package com.MobileNurse;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;

import com.worklight.androidgap.WLDroidGap;

public class BarcodePlugin extends CordovaPlugin {
	
	
	public static final int REQUEST_CODE = 0x0ba7c0de;


	public static final String defaultInstallTitle = "Install Barcode Scanner?";
	public static final String defaultInstallMessage = "This requires the free Barcode Scanner app. Would you like to install it now?";
	public static final String defaultYesString = "Yes";
	public static final String defaultNoString = "No";

	public CallbackContext callback;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callback = callbackContext;

		try {
			if (action.equals("encode")) {
				String type = null;
				if(args.length() > 0) {
					type = args.getString(0);
				}

				String data = null;
				if(args.length() > 1) {
					data = args.getString(1);
				}

				String installTitle = defaultInstallTitle;
				if(args.length() > 2) {
					installTitle = args.getString(2);
				}

				String installMessage = defaultInstallMessage;
				if(args.length() > 3) {
					installMessage = args.getString(3);
				}

				String yesString = defaultYesString;
				if(args.length() > 4) {
					yesString = args.getString(4);
				}

				String noString = defaultNoString;
				if(args.length() > 5) {
					noString = args.getString(5);
				}

				// if data.TypeOf() == Bundle, then call
				// encode(type, Bundle)
				// else
				// encode(type, String)
				this.encode(type, data, installTitle, installMessage, yesString, noString);
			}
			else if (action.equals("scan")) {
				String barcodeTypes = null;
				if(args.length() > 0) {
					barcodeTypes = args.getString(0);
				}

				String installTitle = defaultInstallTitle;
				if(args.length() > 1) {
					installTitle = args.getString(1);
				}

				String installMessage = defaultInstallMessage;
				if(args.length() > 2) {
					installMessage = args.getString(2);
				}

				String yesString = defaultYesString;
				if(args.length() > 3) {
					yesString = args.getString(3);
				}

				String noString = defaultNoString;
				if(args.length() > 4) {
					noString = args.getString(4);
				}

				scan(barcodeTypes, installTitle, installMessage, yesString, noString);
			} else {
	            return false;
			}
			PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
			r.setKeepCallback(true);
			return false;
		} catch (JSONException e) {
			e.printStackTrace();
			return false;
		}

	}

	private void showDownloadDialog(final String title, final String message, final String yesString, final String noString) {
		final WLDroidGap context = (WLDroidGap)this.webView.getContext();
		Runnable runnable = new Runnable() {
			public void run() {

				AlertDialog.Builder dialog = new AlertDialog.Builder(context);
				dialog.setTitle(title);
				dialog.setMessage(message);
				dialog.setPositiveButton(yesString, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dlg, int i) {
						dlg.dismiss();
							//	We don't have the market app installed, so download it directly.
							Intent in = new Intent(Intent.ACTION_VIEW);
							in.setData(Uri.parse("http://zxing.googlecode.com/files/BarcodeScanner4.1.apk"));
							context.startActivity(in);


					}
				});
				dialog.setNegativeButton(noString, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dlg, int i) {
						dlg.dismiss();
					}
				});
				dialog.create();
				dialog.show();
			}
		};
		context.runOnUiThread(runnable);
	}
	
	public void scan(String barcodeFormats, String installTitle, String installMessage, String yesString, String noString ) {
	    Intent intentScan = new Intent("com.google.zxing.client.android.SCAN");
	   // intentScan.addCategory(Intent.CATEGORY_DEFAULT);

	    //设置扫描特定类型的二维码
	    //if (barcodeFormats != null) {
	    //      Tell the scanner what types we're after
	    //			intentScan.putExtra("SCAN_FORMATS", barcodeFormats);
	    // }
	    try {
	    	((WLDroidGap)this.webView.getContext()).startActivityForResult((CordovaPlugin) this, intentScan, REQUEST_CODE);
	    } catch (ActivityNotFoundException e) {
	    	showDownloadDialog(installTitle, installMessage, yesString, noString);
	    }
	}
	
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		if (requestCode == REQUEST_CODE) {
			if (resultCode == WLDroidGap.RESULT_OK) {
				String contents = intent.getStringExtra("SCAN_RESULT");
				String format = intent.getStringExtra("SCAN_RESULT_FORMAT");
				this.callback.sendPluginResult(new PluginResult(PluginResult.Status.OK, contents));
			} else {
				this.callback.error("failure");
				//this.(new PluginResult(PluginResult.Status.ERROR), this.callback);
			}
		}
	}

	
	public void encode(String type, String data, String installTitle, String installMessage, String yesString, String noString) {
		Intent intentEncode = new Intent("com.google.zxing.client.android.ENCODE");
		intentEncode.putExtra("ENCODE_TYPE", type);
		intentEncode.putExtra("ENCODE_DATA", data);

		try {
			((WLDroidGap)this.webView.getContext()).startActivity(intentEncode);
		} catch (ActivityNotFoundException e) {
			showDownloadDialog(installTitle, installMessage, yesString, noString);
		}
	}
}
