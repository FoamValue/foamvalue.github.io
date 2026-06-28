---
layout: post
title: struts2 下的 excel 导入
description: struts2 js 异步上传 excel 导入
author: 陈鑫杰
---

异步上传文件，实现导入 excel 导入功能。  

## ajaxfileupload.js
{% highlight js %}
jQuery.extend({
	createUploadIframe: function(id, uri) { // 创建一个iframe
		var frameId = 'jUploadFrame' + id;
		var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
		if(window.ActiveXObject) {
			if(typeof uri== 'boolean') {
				iframeHtml += ' src="' + 'javascript:false' + '"';
			} else if(typeof uri== 'string') {
				iframeHtml += ' src="' + uri + '"';
		    }
		}
		iframeHtml += ' />';
		jQuery(iframeHtml).appendTo(document.body);
		return jQuery('#' + frameId).get(0);
    },
	createUploadForm: function(id, fileElementId, data) { // 创建一个form
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
		if(data) {
			for(var i in data) {
				jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		var oldElement = jQuery('#' + fileElementId);
		var newElement = jQuery(oldElement).clone();
		jQuery(oldElement).attr('id', fileId);
		jQuery(oldElement).before(newElement);
		jQuery(oldElement).appendTo(form);
		jQuery(form).css('position', 'absolute');
		jQuery(form).css('top', '-1200px');
		jQuery(form).css('left', '-1200px');
		jQuery(form).appendTo('body');		
		return form;
	},
    ajaxFileUpload: function(s) { // 上传文件
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();
		var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;
        if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}
        var requestDone = false;
        var xml = {};
        if (s.global) {
        	jQuery.event.trigger("ajaxSend", [xml, s]);
        }
        var uploadCallback = function(isTimeout) {
			var io = document.getElementById(frameId);
            try {
				if(io.contentWindow) {
					// Struts2 返回后会存在一个<pre>标签问题
					xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.querySelector("pre").innerHTML:null;
                	xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
				} else if(io.contentDocument) {
					xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            } catch(e) {
				jQuery.handleError(s, xml, null, e);
			}
            if ( xml || isTimeout == "timeout") {		
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    if (status != "error") {
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        if (s.success) {
                        	s.success(data, status);
                        }
                        if(s.global) {
                        	jQuery.event.trigger("ajaxSuccess", [xml, s]);
                        }
                    } else {
                    	jQuery.handleError(s, xml, status);
                    }
                } catch(e) {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }
                if(s.global) {
                	jQuery.event.trigger("ajaxComplete", [xml, s]);
                }
                if (s.global && ! --jQuery.active) {
                	jQuery.event.trigger("ajaxStop");
                }
                if (s.complete) {
                	s.complete(xml, status);
                }
                jQuery(io).unbind();
                setTimeout(function() {
                	try {
                		jQuery(io).remove();
                		jQuery(form).remove();
					} catch(e) {
						jQuery.handleError(s, xml, null, e);
					}		
				}, 100);
                xml = null;
            }
        }
        if (s.timeout > 0) {
            setTimeout(function(){
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try {
			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
            if(form.encoding) {
				jQuery(form).attr('encoding', 'multipart/form-data');      			
            } else {
				jQuery(form).attr('enctype', 'multipart/form-data');			
            }			
            jQuery(form).submit();
        } catch(e) {			
        	jQuery.handleError(s, xml, null, e);
        }
		jQuery('#' + frameId).load(uploadCallback);
        return {abort: function () {}};
    },
    uploadHttpData: function(r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        if (type == "script") {
        	jQuery.globalEval( data );
        }
        if (type == "json") {
        	eval( "data = " + data );
        }
        if (type == "html") {
        	jQuery("<div>").html(data).evalScripts();
        }
        return data;
    }
})
{% endhighlight %}

## demo.jsp
{% highlight jsp %}
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>demo</title>
</head>
<body>
  <input type="file" name="fileupload" id="fileupload" value="选择导入文件">
	<button id="upload">保存</button>

	<script type="text/javascript" src="../ajaxfileupload.js"></script>

	<script type="text/javascript">
	$(document).ready(function() {
		$("#upload").click(function() {
			// 上传文件判断 只接受 .xls
			var filePath = $("#fileupload").val();
			if (filePath == "") {
				alert("请选择上传文件");
				return false;
			}
		  var suffix = filePath.substring(filePath.lastIndexOf("."),filePath.length)
			console.log("suffix:" + suffix);
		  if (suffix == "" || suffix != ".xls") {
				alert("请选择正确的文件格式");
				return false;
		  }

			$.ajaxFileUpload({
				url: '/upload',
				secureuri:false,
				fileElementId:'fileupload',
				dataType: 'json',
				data:{},
				success: function (data, status) {
					alert(data.msg);
					if (status) {
				  	return true;
					}
				},
				error: function (data, status, e) {
					console.log("e:" + e);
				}
			})
		});
	});
	</script>
</body>
</html>
{% endhighlight %}

## DemoAction.java
{% highlight java %}
package cn.foamvalue.demo;

import ...

public class DemoAction extends BaseAction {

	/**
	 * @Fields fileupload : 上传的文件
	 */
	private File fileupload;

	/**
	 * @Fields fileuploadFileName : 上传的文件名称
	 */
	private String fileuploadFileName;

	/**
	 * @Fields fileuploadContentType : 上传的文件类型
	 */
	private String fileuploadContentType;

	@Action(value = "/upload")
	public String upload() {
		ResultJson<String> resultJson = new ResultJson<String>();
		try {
			if (fileupload != null && fileupload.exists()) {

				String dstPath = getServletContext().getRealPath("\\jsp\\upload")  + "\\" + fileuploadFileName;  // 保存目录可以自己配置 或者定义变量自行配置  
				File file = new File(dstPath);  
				// 文件已存在删除旧文件（上传了同名的文件）  
				if (file.exists()) {  
					file.delete();  
					file = new File(dstPath);  
				}  
				// 复制并重命名
				copy(fileupload, file);  

				InputStream input = new BufferedInputStream(new FileInputStream(file), BUFFER_SIZE);
				HSSFWorkbook workBook = new HSSFWorkbook(input);

				for (int i=0; i < workBook.getNumberOfSheets(); i++ ) {
					HSSFSheet sheet = workBook.getSheetAt(i);
					if (sheet != null) {
						for (int j=1; j < sheet.getLastRowNum() + 1; j++) {
							HSSFRow row = sheet.getRow(j);
							if (row != null) {
								// 具体逻辑
							}
						}
					}
				}
				resultJson.setIsSuccess(true);
				resultJson.setMsg(ResultCode.SUCCESS.toString());
			} else {
				resultJson.setIsSuccess(false);
				resultJson.setMsg(ResultCode.ERRORPARAM.toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultJson.setIsSuccess(false);
			resultJson.setMsg(ResultCode.ERROR.toString());
		}
		write(resultJson);
		return null;
	}

	public File getFileupload() {
		return fileupload;
	}

	public void setFileupload(File fileupload) {
		this.fileupload = fileupload;
	}

	public String getFileuploadFileName() {
		return fileuploadFileName;
	}

	public void setFileuploadFileName(String fileuploadFileName) {
		this.fileuploadFileName = fileuploadFileName;
	}

	public String getFileuploadContentType() {
		return fileuploadContentType;
	}

	public void setFileuploadContentType(String fileuploadContentType) {
		this.fileuploadContentType = fileuploadContentType;
	}

}
{% endhighlight %}

## BaseAction.java
{% highlight java %}
package cn.foamvalue.demo;

import ...

public class BaseAction extends ActionSupport {

	public static final int BUFFER_SIZE = 2 * 1024;

	public BaseAction() {
	}

	public HttpServletRequest getRequest() {
		return ServletActionContext.getRequest();
	}

	public HttpServletResponse getResponse() {
		return ServletActionContext.getResponse();
	}

	public HttpSession getSession() {
		return ServletActionContext.getRequest().getSession();
	}

	public ServletContext getServletContext() {
		return ServletActionContext.getServletContext();
	}

	public String getRealyPath(String path) {
		return getServletContext().getRealPath(path);
	}

	public void write(Object obj) {
		try {
			HttpServletResponse response = getResponse();
			response.setContentType("application/json;charset=utf-8");
			PrintWriter out = response.getWriter();
			if (obj == null) {
				out.println("[]");
			} else {
				out.println(gson.toJson(obj));
			}
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void copy(File src, File dst) {
		InputStream in = null;
		OutputStream out = null;
		try {
			if (dst.exists()) {
				out = new BufferedOutputStream(new FileOutputStream(dst, true), BUFFER_SIZE); // plupload
			} else {
				out = new BufferedOutputStream(new FileOutputStream(dst), BUFFER_SIZE);
			}
			in = new BufferedInputStream(new FileInputStream(src), BUFFER_SIZE);

			byte[] buffer = new byte[BUFFER_SIZE];
			int len = 0;
			while ((len = in.read(buffer)) > 0) {
				out.write(buffer, 0, len);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (null != out) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
{% endhighlight %}
