jQuery(function($){

    var Item = Backbone.Model.extend({

        // デフォルト
        defaults: {
            date: '',
            money: '',
            name: ''
        },

        // 初期化
        initialize: function () {

        },

        // 入力チェック
        validate: function (attrs) {

            // 今回使ってない！
            if (attrs.text.length === 0) {
                return "本文が入力されていません";
            }
        }
    });

    var List = Backbone.Collection.extend({

        // 結合するモデル
        model: Item,

        // ストレージオブジェクトを保持する
        storageObj: localStorage,

        // ソート関数？
        comparator: function (m) {

            return m.date;

        },

        // 初期化
        initialize: function () {

            var me = this,
                datas;

            // リスナー設定
            me.setListener();

            // データ取得
            datas = me.getStorage();

            if (datas && !!datas.length) {
                $.each(datas, function(i, data){
                    me.addItem(data);
                });
            }

        },

        // リスナー設定
        setListener: function (){

            var me = this;

            // 追加時イベント定義
            me.bind('add', function(m, c, opt) {

                // 全部取ってデータをストレージに保存
                me.setStorage(c.slice());

            });

            // イベントリスナー設定
            me.bind('addItem', function(data) {

                var chk;

                if (!data) {
                    return false;
                }

                chk = data.date || null;

                if (!chk) {
                    alert('空です！');
                    return false;
                }

                // 日付チェック
                if (!chk.match(/^([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
                    alert("日付の形式が正しくありません。");
                    return false;
                }

                if (!chk) {
                    alert('空です！');
                    return false;
                }

                // 金額数値チェック
                chk = data.money || null;
                if (!isFinite(chk)) {
                    alert("金額は数値を入力してください。");
                    return false;
                }

                // コレクションのメソッド呼び出し
                me.addItem(data);

            });

        },

        // アイテム保存
        addItem: function (data) {

            var me = this,
                m;

            // モデルインスタンス生成
            m = new Item(data);

            // データ保存
            me.add(m);

        },

        // ストレージ保存
        setStorage: function(v) {

            this.storageObj.setItem('data', JSON.stringify(v));

        },

        // ストレージから取得
        getStorage: function() {

            var v = this.storageObj.getItem('data');
            return v === null ? null : JSON.parse(v);

        }

    });

    var ItemView = Backbone.View.extend({
        tagName: 'tr', // name of tag to be created

        render: function(){
            var tpl = "<td><%= date %></td><td><%= name %></td><td><%= money %></td>";
            var compiled = _.template(tpl);
            var html = compiled({
                date: this.model.get('date'),
                name: this.model.get('name'),
                money: this.model.get('money')
            });

            $(this.el).html(html);
            return this;
        }
    });

    var ListView = Backbone.View.extend({

        el: $('body'), // el attaches to existing element
        initialize: function(){
            this.collection = new List();
            this.collection.bind('add', this.appendItem); // collection event binder
        },
        events: {
            'click #record': 'addItem'
        },
        render: function(){
            var self = this,
                all = self.collection.slice();

            if (!!all.length) {
                $.each(all, function(i, item) {
                    self.appendItem(item);
                });
            }

        },

        appendItem: function(item){
            var itemView = new ItemView({
                model: item
            });
            $('table#list', this.el).append(itemView.render().el);
        },

        addItem: function () {

            var receiveOrSpend = $('[name="receiveSpend"]:checked').val();
            var tempMoney = $('#money').val();
            if ( receiveOrSpend == 0 ) {
                tempMoney = tempMoney * (-1);
            }

            listView.collection.trigger('addItem', {
                date: $("#date").val(),
                money: tempMoney,
                name: $("#name").val()
            });
        }

    });

    listView = new ListView();
    listView.render();

});
