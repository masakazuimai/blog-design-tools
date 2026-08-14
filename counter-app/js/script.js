$(document).ready(function () {
  var $list = $("#counter-list");
  var $emptyState = $("#empty-state");

  // 合計 = すべてのカウンターの「単価 × 数量」の総和
  function updateTotalSum() {
    var totalSum = 0;
    $list.find(".button").each(function () {
      var unitPrice = parseInt($(this).find(".counter-name").val(), 10) || 0;
      var count = parseInt($(this).find(".counter").text(), 10) || 0;
      totalSum += unitPrice * count;
    });
    $("#total-sum").text(totalSum.toLocaleString("ja-JP"));
  }

  function updateEmptyState() {
    $emptyState.toggleClass("is-hidden", $list.find(".button").length > 0);
  }

  function addCounterEvents($counter) {
    var counter = 0;
    var $counterSpan = $counter.find(".counter");
    var $counterName = $counter.find(".counter-name");

    function render() {
      $counterSpan.text(counter);
      updateTotalSum();
    }

    $counter.find(".increment").on("click", function () {
      counter++;
      render();
    });

    $counter.find(".decrement").on("click", function () {
      counter--;
      render();
    });

    $counter.find(".reset").on("click", function () {
      counter = 0;
      render();
    });

    $counter.find(".remove").on("click", function () {
      $counter.fadeOut("fast", function () {
        $(this).remove();
        updateTotalSum();
        updateEmptyState();
      });
    });

    // 単価入力中は誤操作を防ぐためボタンを無効化する
    $counterName.on("focus", function () {
      $counter.find(".increment, .decrement, .reset, .remove").prop("disabled", true);
    });

    $counterName.on("blur", function () {
      $counter.find(".increment, .decrement, .reset, .remove").prop("disabled", false);
      updateTotalSum();
    });

    // 全角数字を半角へ変換してから合計に反映する
    $counterName.on("input", function () {
      var converted = $counterName.val().replace(/[０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });
      $counterName.val(converted);
      updateTotalSum();
    });
  }

  $("#add-counter").on("click", function () {
    var $newCounter = $(
      '<div class="button">' +
        '<span class="drag-handle" aria-hidden="true">&#10287;</span>' +
        '<input type="text" class="counter-label" placeholder="名称（例：りんご）" aria-label="名称">' +
        '<div class="counter-field">' +
        '<label class="counter-field-label">単価</label>' +
        '<input type="text" class="counter-name" inputmode="numeric" placeholder="0" aria-label="単価">' +
        "</div>" +
        '<p class="counter-title">数量<span class="counter">0</span></p>' +
        '<div class="counter-actions">' +
        '<button type="button" class="increment" aria-label="1つ増やす">＋</button>' +
        '<button type="button" class="decrement" aria-label="1つ減らす">－</button>' +
        '<button type="button" class="reset">リセット</button>' +
        '<button type="button" class="remove">削除</button>' +
        "</div>" +
        "</div>",
    );

    $newCounter.appendTo($list).hide().fadeIn();
    addCounterEvents($newCounter);
    updateEmptyState();
  });

  // カードをドラッグで並べ替える（ハンドルからのみ開始）
  $list.sortable({
    items: ".button",
    handle: ".drag-handle",
    placeholder: "counter-placeholder",
    forcePlaceholderSize: true,
    cursor: "grabbing",
    tolerance: "pointer",
  });
});
