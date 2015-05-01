Ext.onReady(function(){
    Ext.QuickTips.init();
	var panel = new AppUserView();
	panel.render(Ext.getBody());
	});
var __ctxPath= "";
AppUserView = Ext.extend(Ext.Panel, {
		constructor : function(a) {
			Ext.applyIf(this, a);
			this.initUIComponents();
			AppUserView.superclass.constructor.call(this, {
						id : "AppUserView",
						title : "demo", 
						layout : "border",
						items : [this.searchPanel, this.gridPanel],
						autoScroll : true
					});
		},
		initUIComponents : function() {
			this.searchPanel = new Orient.SearchPanel({
						region : "north",
						layout : "form",
						colNums : 5,
						keys : {
							key : Ext.EventObject.ENTER,
							fn : this.search,
							scope : this
						},
						labelWidth : 55,
						items : [{
									fieldLabel : "用户账号",
									xtype : "textfield",
									name : "Q_userName_S_LK",
									maxLength : 150
								}, {
									fieldLabel : "用户姓名",
									xtype : "textfield",
									name : "Q_allName_S_LK",
									maxLength : 150
								}, {
									xtype : "button",
									text : "查询",
									iconCls : "toolbarsearch",
									scope : this,
									handler : this.search
								}]
					});
			this.gridPanel = new Orient.GridPanel({
				exportable : false,
				region : "center",
				tbar : [{
							xtype : "button",
							iconCls : "toolbarAdd",
							text : "添加账号",
							scope : this,
							handler : this.addUser 
						}, "-", {
							xtype : "button",
							iconCls : "toolbardelete",
							text : "删除账号",
							scope : this,
							handler : this.removeSelRs 
						}],
				url : "",
				fields : ["id", "allName", "userName", "depName","sex","state"],
				columns : [{
							header : "id",
							dataIndex : "id",
							hidden : true
						}, {
							header : "状态",
							dataIndex : "state",
							width : 30,
							renderer : function(a) {
								var b = "";
								if (a == "1") {
									b += '<img title="激活" src="'
											+ __ctxPath
											+ '/image/check/effective.png"/>';
								} else {
									b += '<img title="禁用" src="'
											+ __ctxPath
											+ '/image/check/invalid.png"/>';
								}
								return b;
							}
						}, {
							header : "账号",
							dataIndex : "userName",
							width : 60 
						}, {
							header : "用户名",
							dataIndex : "allName",
							width : 60
						}, {
							header : "性别",
							dataIndex : "sex",
							width : 120,
							renderer : function(a) {
								var b = "";
								if (a == "1") {
									b += '男';
								} else {
									b += '女';
								}
								return b;
							}
						}, {
							header : "所属部门",
							dataIndex : "depName",
							sortable : false,
							width : 60
						} ],
				listeners : {
					scope : this,
					"rowdblclick" : this.rowdblclick
				}
			});
		},
		search : function() {
			$search({
						searchPanel : this.searchPanel,
						gridPanel : this.gridPanel
					});
		},
		addUser : function() {
			App.clickTopTabBySea("UserFormPanel","edmJs/js/system/UserFormPanel");
		},
		onRowAction : function(c, a, d, e, b) {
			this.userId = a.data.id;
			this.username = a.data.userName;
			switch (d) {
				case "toolbardelete" :
					this.removeRs.call(this);
					break;
				case "toolbarupdate" :
					this.editRs.call(this);
					break;
				case "toolbarright" :
					this.grantRs.call(this, a);
					break;
				case "toolbarsetpassword" :
					this.resetRs.call(this);
					break;
				default :
					break;
			}
		},
		removeSelRs : function() {
			var a = this.gridPanel.getSelectionModel().getSelections();
			if (a[0].data.id < 1) {
				Ext.ux.Toast.msg("信息", "超级管理员不删除,请选择其他用户!");
				return;
			}
			$delGridRs({
						url :__ctxPath + "/edm/sysman/user/delete.edm",
						grid : this.gridPanel,
						idName : "id"
					});
		},
		removeRs : function() {
			Ext.Msg.confirm("删除操作", "你确定要删除该用户吗?", function(a) {
						if (a == "yes") {
							Ext.Ajax.request({
										url :__ctxPath + "/edm/sysman/user/delete.edm",
										method : "post",
										params : {
											ids : this.userId
										},
										scope : this,
										success : function(c) {
											var b = Ext.util.JSON.decode(c.responseText);
											if (b.msg == "") {
												Ext.ux.Toast.msg("操作信息", "用户删除成功");
											} else {
												Ext.ux.Toast.msg("操作信息", b.msg);
											}
											this.gridPanel.getStore().reload();
										},
										failure : function() {
											Ext.ux.Toast.msg("操作信息", "用户删除失败");
										}
									});
						}
					}, this);
		},
		editRs : function() {
			App.clickTopTabBySea("UserFormPanel_" + this.userId,"edmJs/js/system/UserFormPanel",{
						userId : this.userId,
						username : this.username
					});
		},
		grantRs : function(a) {
			 XhRwFxtGwGrantView.init({
						userId : a.data.id,
						userName : a.data.userName
					}).show();
		},
		resetRs : function() {
			 SetPasswordForm.init({
						userId : this.userId
					}).show();
		},
		rowdblclick : function(b, a, c) {
			b.getSelectionModel().each(function(d) {
						this.userId = d.data.id;
						this.username = d.data.userName; 
					    this.editRs(); 
					}, this);
		}
	});