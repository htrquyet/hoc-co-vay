(function (root) {
  'use strict';

  const BLACK = 1;
  const WHITE = 2;

  const EXTRA_LESSONS = [
    // ==================== STAGE 1 (+3 -> 7) ====================
    {
      id: 'lesson-1-5',
      stageId: 'stage-1',
      code: '1.5',
      title: 'Dồn Quân Vào Biên (Edge Atari)',
      jpTerm: 'Hane-komi / Oikomi (Ép biên)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Khi bắt quân gần cạnh bàn cờ, luôn chặn phía hướng ra trung tâm để ép đối phương đâm đầu vào biên ít khí.',
      theoryHtml: `
        <p>Sai lầm kinh điển của người mới là thấy quân địch gần biên liền <strong>Atari từ phía cạnh bàn cờ</strong> — vô tình đẩy đối phương chạy thẳng ra trung tâm rộng lớn!</p>
        <ul>
          <li><strong>Hướng đúng:</strong> Chặn từ phía <strong>bên trong (hướng trung tâm)</strong>. Quân địch chỉ còn đường chạy sát ra biên (nơi tối đa chỉ có 3 khí, ở góc chỉ còn 2 khí) và nhanh chóng bị bắt gọn.</li>
          <li><strong>Hướng sai:</strong> Chặn từ phía biên đẩy địch thoát vào trung tâm (4 khí/nước), càng đuổi càng xa.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Bắt quân phải đẩy vào tường biên hoặc góc — tuyệt đối không đẩy ra giữa bàn!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 0], [3, 1], [5, 1]],
        white: [[4, 1]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E7 chặn giữa',
          summary: 'Chặn hướng ra trung tâm ở E7 để dồn Trắng lên sát biên E9 rồi ăn gọn.',
          steps: [
            {
              caption: 'Quân Trắng E8 đang có 2 khí: E9 (sát biên trên) và E7 (hướng ra giữa bàn).',
              why: 'Muốn bắt được Trắng, Đen phải chọn hướng ép Trắng đi vào chỗ ít khí hơn — đó là đường biên trên.'
            },
            {
              moves: [{ x: 4, y: 2, color: BLACK }],
              caption: 'Đen đánh E7 (Atari từ phía trung tâm)! Trắng bị bịt hoàn toàn đường thoát ra giữa bàn.',
              why: 'Nước E7 vừa giữ liên kết vững giữa D8 và F8, vừa chỉ chừa cho Trắng đúng 1 lối thoát duy nhất lên cạnh bàn cờ E9.'
            },
            {
              moves: [{ x: 4, y: 0, color: WHITE }],
              caption: 'Trắng buộc phải chạy lên sát biên tại E9.',
              why: 'Sau khi lên E9, cụm 2 quân Trắng đụng tường biên trên nên chỉ còn tối đa 1 khí duy nhất ở F9!'
            },
            {
              moves: [{ x: 5, y: 0, color: BLACK }],
              caption: 'Đen chặn F9 — ăn trọn cả 2 quân Trắng!',
              why: 'Vì bị ép vào đường 1 ít khí, Trắng không có không gian xoay xở và bị bắt sạch chỉ sau 2 nước.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: E9 từ biên',
          summary: 'Đánh từ biên E9 vô tình đẩy Trắng chạy thẳng ra trung tâm nhiều khí.',
          steps: [
            {
              caption: 'Xét trường hợp Đen chọn Atari từ phía biên trên (E9).',
              why: 'Nhiều bạn mới thấy đường biên ngắn liền chặn E9 trước — hãy xem hậu quả.'
            },
            {
              moves: [{ x: 4, y: 0, color: BLACK }],
              caption: 'Đen đánh E9 (chiếu từ phía biên).',
              why: 'Nước này khóa cạnh bàn cờ nhưng lại mở toang cánh cửa E7 dẫn thẳng ra vùng trung tâm rộng lớn.'
            },
            {
              moves: [{ x: 4, y: 2, color: WHITE }],
              caption: 'Trắng lập tức chạy xuống E7! Cụm Trắng có ngay 3 khí mới và cắt đôi hai cánh quân Đen.',
              why: 'Không những Trắng thoát chết với nhiều khí (D7, F7, E6), mà quân Đen D8 và F8 còn bị chia cắt!'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy chọn hướng Atari chính xác để dồn quân Trắng E8 vào biên và ăn trọn cả 2 quân!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 0], [3, 1], [5, 1]],
          white: [[4, 1]]
        },
        hint: {
          text: 'Hãy chặn phía dưới (E7) để ép Trắng chạy lên đường biên E9 rồi khóa F9.',
          marker: { x: 4, y: 2, type: 'circle' }
        },
        tree: {
          '4,2': {
            status: 'continue',
            reply: [4, 0],
            feedback: 'Chính xác! Trắng buộc phải chạy lên sát biên E9. Hãy bịt nốt khí cuối cùng tại F9!',
            next: {
              '5,0': {
                status: 'solved',
                feedback: 'Tuyệt vời! Bạn đã ép Trắng vào đường 1 và bắt gọn cả 2 quân Trắng.'
              }
            }
          },
          '4,0': {
            status: 'wrong',
            reply: [4, 2],
            feedback: 'Sai hướng! Đánh E9 đẩy Trắng chạy xuống E7 ra trung tâm với 3 khí và chia cắt quân Đen.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy chặn hướng ra trung tâm (E7) để dồn Trắng lên biên.'
      }
    },
    {
      id: 'lesson-1-6',
      stageId: 'stage-1',
      code: '1.6',
      title: 'Ăn Quân Để Tự Cứu (Counter-Capture)',
      jpTerm: 'Seme-tori / Iki-atari (Phản sát)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Khi hai nhóm quân cùng chỉ còn 1 khí (cùng bị Atari), ai đến lượt ăn quân trước sẽ thoát hiểm và thắng lợi.',
      theoryHtml: `
        <p>Trong thực chiến, rất thường gặp tình huống quân bạn đang bị <strong>Atari (1 khí)</strong>, nhưng ngay bên cạnh có một cụm quân địch cũng chỉ còn <strong>1 khí</strong>!</p>
        <ul>
          <li><strong>Đừng vội chạy thụ động:</strong> Nếu bạn chạy ở phía khác, đối thủ sẽ ăn nhóm quân yếu của bạn trước.</li>
          <li><strong>Hãy ăn quân địch ngay:</strong> Khi bạn ăn được quân địch, nhóm quân của bạn lập tức nhận thêm toàn bộ khoảng trống vừa ăn làm <strong>khí mới</strong> và thoát chết ngoạn mục!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Quy tắc phản công:</strong> “Khi quân mình còn 1 khí, luôn kiểm tra xem quân vây mình có nhóm nào cũng còn 1 khí không!”</div>
      `,
      demoInitialPosition: {
        black: [[1, 1], [1, 2], [2, 0], [3, 0], [3, 2], [2, 3]],
        white: [[1, 0], [0, 2], [0, 3], [1, 3], [2, 1], [2, 2]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D8 ăn 2 quân',
          summary: 'Ăn ngay cặp quân Trắng C8-C7 để cứu cụm B8-B7 và giải tỏa toàn bộ áp lực.',
          steps: [
            {
              caption: 'Cụm Đen B8-B7 chỉ còn 1 khí (A8). Đồng thời cụm Trắng C8-C7 cũng chỉ còn đúng 1 khí tại D8!',
              why: 'Hai cụm quân đang cùng trong trạng thái Atari — ai đánh vào khí cuối của đối phương trước sẽ giành chiến thắng.'
            },
            {
              moves: [{ x: 3, y: 1, color: BLACK }],
              caption: 'Đen đánh thẳng vào D8 — ăn gọn 2 quân Trắng C8-C7!',
              why: 'Khi 2 quân Trắng bị nhấc ra khỏi bàn cờ, cụm Đen B8-B7 có ngay 3 khí mới (C8, C7, A8) và liên kết hoàn toàn với C9-D9.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: A8 chạy thụ động',
          summary: 'Chạy A8 không đủ khí thoát và để Trắng ăn trước ở A9.',
          steps: [
            {
              caption: 'Xét trường hợp Đen lo sợ nên đánh A8 để chạy khỏi Atari.',
              why: 'Người mới thường theo phản xạ chạy vào khí cuối của mình mà quên nhìn khí của địch.'
            },
            {
              moves: [{ x: 0, y: 1, color: BLACK }],
              caption: 'Đen nối ra A8, nhưng A8 ở sát biên trên nên cả cụm 3 quân vẫn chỉ có đúng 1 khí tại A9!',
              why: 'Đây là nước chạy không tăng thêm được khí (còn gọi là chạy vào đường cùng).'
            },
            {
              moves: [{ x: 0, y: 0, color: WHITE }],
              caption: 'Trắng lập tức đánh A9, ăn sạch cả 3 quân Đen!',
              why: 'Vì Đen bỏ lỡ cơ hội ăn C8-C7 ở D8, Trắng không những cứu được quân mình mà còn hốt trọn 3 quân Đen.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Cụm Đen B8-B7 đang chỉ còn 1 khí (A8), nhưng đừng chạy vào A8! Hãy tìm nước ăn quân địch để tự cứu!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 1], [1, 2], [2, 0], [3, 0], [3, 2], [2, 3]],
          white: [[1, 0], [0, 2], [0, 3], [1, 3], [2, 1], [2, 2]]
        },
        hint: {
          text: 'Kiểm tra số khí của hai quân Trắng C8-C7 — chúng chỉ còn duy nhất 1 khí tại D8!',
          marker: { x: 3, y: 1, type: 'circle' }
        },
        tree: {
          '3,1': {
            status: 'solved',
            feedback: 'Tuyệt vời! Ăn gọn 2 quân Trắng tại D8 giúp cụm Đen có ngay 3 khí mới và thoát hiểm hoàn toàn!'
          },
          '0,1': {
            status: 'wrong',
            reply: [0, 0],
            feedback: 'Chạy A8 chỉ còn 1 khí ở A9 — Trắng đánh A9 và bắt trọn cả 3 quân Đen!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm cụm quân Trắng đang chỉ còn 1 khí để phản công ăn quân.'
      }
    },
    {
      id: 'lesson-1-7',
      stageId: 'stage-1',
      code: '1.7',
      title: 'Khóa Biên Đất & Đếm Điểm Cuối Ván',
      jpTerm: 'Shucho / Chi-kazoeru (Khép biên & Đếm đất)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Đất chỉ được tính điểm khi được quân mình bao vây kín 100%; nếu hở dù chỉ 1 lỗ, vùng đất đó không thuộc về bạn.',
      theoryHtml: `
        <p>Rất nhiều bạn mới chơi thắc mắc: <em>“Tại sao cuối ván máy không tính đất cho vùng mình vừa vây?”</em> — Lý do thường gặp nhất là <strong>bức tường biên giới còn hở 1 giao điểm</strong>!</p>
        <ul>
          <li>Theo luật Cờ Vây, một vùng trống chỉ tính là <strong>Đất (Territory)</strong> của Đen nếu mọi giao điểm giáp ranh quanh nó đều chạm vào quân Đen (không chạm bất kỳ quân Trắng nào).</li>
          <li><strong>Cách tính thắng thua (Luật Nhật Bản):</strong><br/><code>Tổng điểm = Số ô Đất kín + Số Tù binh bắt được + Komi (6.5 cho Trắng)</code>.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Trước khi Bỏ lượt (Pass):</strong> Luôn quét dọc tường biên giới của mình xem còn khe hở nào thông sang đất địch không!</div>
      `,
      demoInitialPosition: {
        black: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 5], [3, 6], [3, 7], [3, 8]],
        white: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D5 khép kín đất',
          summary: 'Bịt lỗ hở D5 trên bức tường cột D để khóa trọn 27 điểm đất bên trái.',
          steps: [
            {
              caption: 'Trắng đã dựng tường kín ở cột F (27 điểm bên phải). Tường Đen ở cột D gần kín, chỉ còn hở duy nhất ô D5!',
              why: 'Hiện tại vùng trống A–C bên trái thông qua D5 chạm tới cột F của Trắng, nên cả 27 ô bên trái chưa được tính là đất của Đen!'
            },
            {
              moves: [{ x: 3, y: 4, color: BLACK }],
              caption: 'Đen đặt quân vào D5! Bức tường cột D liền mạch từ trên xuống dưới.',
              why: 'Đen chính thức khóa kín 27 điểm đất (3 cột × 9 hàng) bên trái, tạo ra 17 ô Dame trung lập ở cột E và kết thúc ván an toàn.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: B5 tự đánh trong đất',
          summary: 'Đánh B5 vào trong đất nhà vừa tự trừ 1 điểm vừa để Trắng chọc thủng D5.',
          steps: [
            {
              caption: 'Xét trường hợp Đen bỏ quên khe hở D5 và đánh vào B5 bên trong nhà mình.',
              why: 'Đánh vào trong vùng đất đã thuộc về mình là nước đi vô ích (tự mất 1 điểm đất).'
            },
            {
              moves: [{ x: 1, y: 4, color: BLACK }],
              caption: 'Đen đánh B5 — không hề đóng được biên giới ở cột D.',
              why: 'Cửa ngõ D5 vẫn mở toang sang vùng kiểm soát của Trắng!'
            },
            {
              moves: [{ x: 3, y: 4, color: WHITE }],
              caption: 'Trắng lập tức đánh D5! Bức tường Đen bị chọc thủng hoàn toàn.',
              why: 'Toàn bộ vùng đất 27 điểm của Đen bị phá vỡ và Trắng có thể tràn sang cướp thêm đất bên trái.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trước khi Bỏ lượt để kết thúc ván và đếm điểm, hãy bịt lỗ hở duy nhất trên bức tường cột D để khóa kín 27 điểm đất bên trái!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 5], [3, 6], [3, 7], [3, 8]],
          white: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]]
        },
        hint: {
          text: 'Hãy nhìn dọc theo cột D để tìm giao điểm trống duy nhất đang mở thông sang vùng Trắng (D5).',
          marker: { x: 3, y: 4, type: 'circle' }
        },
        tree: {
          '3,4': {
            status: 'solved',
            feedback: 'Chính xác! D5 khép kín toàn bộ bức tường Đen, bảo vệ vững chắc 27 điểm đất bên trái trước khi đếm điểm!'
          },
          '1,4': {
            status: 'wrong',
            reply: [3, 4],
            feedback: 'B5 là tự đánh vào đất nhà! Trắng đánh ngay D5 phá vỡ toàn bộ vùng đất bên trái của Đen.'
          },
          '4,4': {
            status: 'wrong',
            reply: [3, 4],
            feedback: 'E5 vẫn không nối được hai đoạn tường cột D! Trắng cắt vào D5 chia đôi tường Đen ngay lập tức.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy đặt quân vào đúng khe hở D5 trên cột D để nối kín bức tường.'
      }
    },

    // ==================== STAGE 2 (+3 -> 9) ====================
    {
      id: 'lesson-2-7',
      stageId: 'stage-2',
      code: '2.7',
      title: 'Thế Tổ Hạc (Crane’s Nest)',
      jpTerm: 'Tsuru no Sugomori (Tổ Hạc)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Khi 2 quân địch bị ép giữa vòng vây nhưng chưa kịp nối, nước đặt quân chắn đầu từ xa khiến địch chạy hướng nào cũng mất khí.',
      theoryHtml: `
        <p><strong>Thế Tổ Hạc (Crane’s Nest)</strong> là một hình Thủ Cân bắt quân tuyệt đẹp, tương tự như Thế Lưới thu nhỏ:</p>
        <ul>
          <li>Hai quân địch đứng dọc ở giữa vòng vây hở 2 bên sườn và 1 đầu thoát.</li>
          <li>Nếu bạn tham lam đánh Atari trực diện vào một bên sườn, địch sẽ lao thẳng ra đầu thoát còn mở!</li>
          <li>Thay vào đó, bạn <strong>khóa đầu thoát trước</strong> (tạo hình cái tổ bao quanh): lúc này hai bên sườn trở thành ngõ cụt không tăng được khí, địch chạy bên nào cũng bị bắt sạch.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Mẹo nhớ hình:</strong> “Đóng nắp tổ trước, bắt chim sau — vội đánh sườn chim bay mất!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 3], [5, 3], [4, 2], [3, 5], [5, 5], [2, 4], [6, 4]],
        white: [[4, 3], [4, 4]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E4 đóng tổ',
          summary: 'Đánh E4 khóa nắp tổ trước, ép Trắng tự chui vào ngõ cụt D5 hoặc F5 rồi ăn trọn.',
          steps: [
            {
              caption: 'Hai quân Trắng E6-E5 đang có 3 khí: D5, F5 (hai bên sườn) và E4 (lối thoát xuống dưới).',
              why: 'Chú ý hai quân Đen D4 và F4 đã mai phục sẵn hai bên dưới — tạo thành cái khung Tổ Hạc.'
            },
            {
              moves: [{ x: 4, y: 5, color: BLACK }],
              caption: 'Đen đánh E4 (nước Tổ Hạc)! Cả 2 quân Trắng lập tức chỉ còn 2 khí kín là D5 và F5.',
              why: 'Đen khóa cửa dưới trước khi Atari. Bây giờ dù Trắng có chạy sang D5 hay F5, xung quanh đều bị quân Đen bịt kín nên không tăng thêm được khí nào!'
            },
            {
              moves: [{ x: 3, y: 4, color: WHITE }],
              caption: 'Trắng thử chạy sang D5 nhưng bị D6, C5, D4 vây kín — cả 3 quân Trắng chỉ còn 1 khí ở F5!',
              why: 'Nước chạy của Trắng không tạo ra khí mới nào (dân cờ gọi là tự đưa thêm quân vào rọ).'
            },
            {
              moves: [{ x: 5, y: 4, color: BLACK }],
              caption: 'Đen đánh F5 — bắt trọn cả 3 quân Trắng trong Tổ Hạc!',
              why: 'Nhờ khóa cửa E4 trước, Đen biến cả hai bên sườn thành bẫy chết không lối thoát.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D5 đánh sườn',
          summary: 'Atari ở D5 khiến Trắng chạy thẳng xuống E4 thoát khỏi vòng vây.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh ngay vào sườn D5 để Atari.',
              why: 'Nhiều bạn thích thấy chữ Atari ngay nên đánh sát vào D5 hoặc F5.'
            },
            {
              moves: [{ x: 3, y: 4, color: BLACK }],
              caption: 'Đen đánh D5 (Atari Trắng), nhưng để hở lối thoát E4 ở phía dưới.',
              why: 'Dù Trắng chỉ còn 2 khí, Trắng vẫn có thể lao ra cửa E4.'
            },
            {
              moves: [{ x: 4, y: 5, color: WHITE }],
              caption: 'Trắng chạy xuống E4! Trắng có ngay 2 khí mở (E3, F5) và đe dọa cắt đôi hàng quân dưới của Đen!',
              why: 'Một khi Trắng thoát ra E4, cả hai quân Đen D4 và F4 rơi vào thế bị chia cắt và Trắng sống khỏe.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Đừng đánh Atari hai bên sườn! Hãy dùng thế Tổ Hạc (Crane’s Nest) khóa chặt lối thoát của 2 quân Trắng E6-E5 rồi ăn trọn!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 3], [5, 3], [4, 2], [3, 5], [5, 5], [2, 4], [6, 4]],
          white: [[4, 3], [4, 4]]
        },
        hint: {
          text: 'Hãy đóng nắp tổ ở phía dưới giữa D4 và F4 — giao điểm E4!',
          marker: { x: 4, y: 5, type: 'circle' }
        },
        tree: {
          '4,5': {
            status: 'continue',
            reply: [3, 4],
            feedback: 'Quá chuẩn! Trắng chạy D5 nhưng không có thêm khí nào. Hãy đánh F5 để ăn trọn cả 3 quân Trắng!',
            next: {
              '5,4': {
                status: 'solved',
                feedback: 'Hoàn hảo! Bạn đã bắt trọn 3 quân Trắng bằng thế Tổ Hạc mẫu mực!'
              }
            }
          },
          '3,4': {
            status: 'wrong',
            reply: [4, 5],
            feedback: 'Đánh D5 để hở cửa E4! Trắng chạy E4 thoát ra ngoài và cắt ngược lại quân Đen.'
          },
          '5,4': {
            status: 'wrong',
            reply: [4, 5],
            feedback: 'Đánh F5 để hở cửa E4! Trắng chạy xuống E4 và thoát thân dễ dàng.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy khóa cửa thoát E4 trước (hình Tổ Hạc) thay vì đánh hai bên sườn.'
      }
    },
    {
      id: 'lesson-2-8',
      stageId: 'stage-2',
      code: '2.8',
      title: 'Bí Khí Không Thể Nối (Damezumari)',
      jpTerm: 'Damezumari (Tắc Khí)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Đánh vào điểm cắt khiến hai nhóm quân địch tự làm nghẽn khí của nhau — nếu địch cố nối sẽ lập tức rơi vào thế tự sát hoặc còn 1 khí!',
      theoryHtml: `
        <p><strong>Damezumari (Tắc Khí / Thiếu Khí)</strong> là một trong những điểm yếu chiến thuật phổ biến nhất trên bàn cờ:</p>
        <ul>
          <li>Hai nhóm quân đứng gần nhau nhưng vẫn còn hở một điểm cắt ở biên/góc.</li>
          <li>Khi bạn cắt vào giữa, đối phương muốn nối lại nhưng phát hiện ra <strong>nếu nối vào thì cả cụm mới tạo thành chỉ còn đúng 1 khí (hoặc 0 khí)</strong>!</li>
          <li>Nhờ lợi dụng tình trạng thiếu khí đó, bạn bắt gọn cả nhóm lớn tưởng chừng đang nối liền.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Cách ngôn:</strong> “Bí khí sinh tai họa — luôn kiểm tra xem khi nối quân lại có bị tụt còn 1 khí không!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 0], [0, 1], [1, 1], [2, 2], [3, 2], [4, 2], [5, 1], [5, 0]],
        white: [[2, 0], [2, 1], [4, 0], [4, 1]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D8 cắt gây bí khí',
          summary: 'Cắt D8 buộc Trắng phải nối ở D9 trong thế còn 1 khí, rồi Đen ăn sạch 5 quân tại B9!',
          steps: [
            {
              caption: 'Hai cặp quân Trắng (C9-C8 và E9-E8) đứng cách nhau 1 ô. Giữa chúng có điểm cắt D8 và D9.',
              why: 'Bên phải (E9-E8) chỉ có 2 khí là D8 và D9; bên trái (C9-C8) có thêm 1 khí ngoài ở B9.'
            },
            {
              moves: [{ x: 3, y: 1, color: BLACK }],
              caption: 'Đen chém vào điểm cắt D8! Nước này vừa nối với tường D7, vừa đặt cặp E9-E8 vào thế Atari (chỉ còn 1 khí D9).',
              why: 'Đây là đòn đánh trúng huyệt Damezumari: ép Trắng phải nối ở D9 nhưng nối xong thì cả đám mới vẫn thiếu khí!'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng buộc phải nối ở D9 để cứu E9-E8 — nhưng cả khối 5 quân Trắng giờ chỉ còn đúng 1 khí tại B9!',
              why: 'Vì Đen đã chặn B8, F8, F9 và D7 từ trước, việc Trắng nối ở D9 biến toàn bộ 5 quân Trắng thành con mồi Atari.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Đen đánh B9 — hốt trọn cả 5 quân Trắng!',
              why: 'Nhờ cắt ở D8 trước, Đen biến thế cờ tưởng như nối được của Trắng thành một cái bẫy Damezumari chết người.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D9 đánh đường 1',
          summary: 'Đánh D9 ở đường 1 bị Trắng đánh D8 ăn lại 1 quân và nối liền vững chắc.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh vào D9 trước để cắt hai cặp Trắng.',
              why: 'Đánh D9 từ phía đường 1 khiến quân Đen D9 tự đứng cô lập chỉ có 1 khí tại D8.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh D9, nhưng quân D9 không nối được với tường D7 bên dưới.',
              why: 'Trái lại, D9 chỉ có đúng 1 khí là D8!'
            },
            {
              moves: [{ x: 3, y: 1, color: WHITE }],
              caption: 'Trắng đánh ngay D8 ăn mất quân Đen D9! Toàn bộ khối Trắng nối liền an toàn với 2 khí (B9 và D9).',
              why: 'Thay vì ép Trắng bí khí, Đen lại tự dâng 1 quân cho Trắng ăn và giúp Trắng có thêm không gian sống.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy chém đúng điểm cắt gây Bí Khí (Damezumari) khiến Trắng không thể nối an toàn, rồi ăn trọn cả 5 quân Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 0], [0, 1], [1, 1], [2, 2], [3, 2], [4, 2], [5, 1], [5, 0]],
          white: [[2, 0], [2, 1], [4, 0], [4, 1]]
        },
        hint: {
          text: 'Hãy cắt vào D8 để vừa nối với tường D7 vừa chiếu cặp E9-E8!',
          marker: { x: 3, y: 1, type: 'circle' }
        },
        tree: {
          '3,1': {
            status: 'continue',
            reply: [3, 0],
            feedback: 'Quá hay! Trắng nối ở D9 nhưng cả 5 quân Trắng chỉ còn 1 khí duy nhất! Hãy đánh B9 để ăn sạch!',
            next: {
              '1,0': {
                status: 'solved',
                feedback: 'Xuất sắc! Bạn đã lợi dụng triệt để thế Bí Khí (Damezumari) để bắt trọn 5 quân Trắng!'
              }
            }
          },
          '3,0': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Sai hướng! Đánh D9 trước bị Trắng ăn ngược lại tại D8 và Trắng nối liền cả đám với 2 khí.'
          },
          '1,0': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Bịt B9 trước quá chậm — Trắng nối ngay ở D8 và sống khỏe với nhiều khí!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy cắt tại D8 nối liền tường D7 để ép Trắng vào thế Bí Khí.'
      }
    },
    {
      id: 'lesson-2-9',
      stageId: 'stage-2',
      code: '2.9',
      title: 'Chặn Đầu Cắt Viện Trợ Dọc Biên',
      jpTerm: 'Saki-atari / Watari-dome (Chặn đường nối biên)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Khi quân địch định luồn đường 1 về nối với đồng đội, hãy đánh cắt từ phía có đồng đội địch để dồn quân yếu vào đường cụt.',
      theoryHtml: `
        <p>Ở vùng sát biên (đường 1 và đường 2), quân cờ rất dễ tìm cách luồn qua đường 1 để chạy về với đồng đội đứng gần đó.</p>
        <ul>
          <li><strong>Nguyên tắc:</strong> Luôn đánh từ phía <strong>ngăn cách quân địch với viện binh</strong> (cắt liên lạc trước), đẩy chúng chạy ngược về phía có tường quân mình chặn sẵn.</li>
          <li>Nếu bạn tham chiếu từ phía tường mình trước, địch sẽ chạy thẳng sang phía kia và nối liền an toàn với đồng đội!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Quy tắc:</strong> “Đuổi địch về phía tường mình — chớ đuổi địch về phía quân của họ!”</div>
      `,
      demoInitialPosition: {
        black: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 1]],
        white: [[3, 1], [4, 1], [6, 0], [6, 1]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E9 cắt viện trợ',
          summary: 'Chặn E9 để cắt đứt liên lạc với G9-G8, dồn Trắng chạy về hướng tường Đen B9 rồi bắt trọn.',
          steps: [
            {
              caption: 'Cặp Trắng D8-E8 chỉ còn 2 khí (D9 và E9). Phía phải có đồng đội G9-G8 đang chờ nối; phía trái có Đen B9 chặn sẵn.',
              why: 'Phải phân biệt ngay hai khí D9 và E9: bên nào gần viện trợ Trắng hơn thì phải chặn bên đó!'
            },
            {
              moves: [{ x: 4, y: 0, color: BLACK }],
              caption: 'Đen đánh E9 (Atari)! Nước này cắt đứt hoàn toàn đường chạy sang phải về G9-G8.',
              why: 'Quân Đen E9 được F8 hỗ trợ ở dưới (F9 trống), nên Trắng không thể vượt qua E9 để sang phải được.'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng chỉ còn đường chạy sang trái tại D9 — nhưng đụng ngay bức tường Đen B9-C8!',
              why: 'Cả 3 quân Trắng giờ chỉ còn duy nhất 1 khí ở C9.'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen chặn C9 — ăn gọn cả 3 quân Trắng!',
              why: 'Chặn hướng viện trợ E9 ngay từ nước đầu đã định đoạt số phận của cả cặp D8-E8.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D9 đẩy về viện binh',
          summary: 'Chiếu từ D9 đẩy Trắng chạy sang E9 nối liền với G9-G8 và thoát chết.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh D9 trước với hy vọng dồn Trắng.',
              why: 'Nếu không để ý cặp G9-G8 đang chờ ở bên phải, bạn rất dễ đánh nhầm vào D9.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh D9, vô tình mở đường cho Trắng chạy sang E9.',
              why: 'Nước D9 lại gần tường Đen B9 (nơi Trắng vốn không chạy qua được), bỏ trống phía E9.'
            },
            {
              moves: [{ x: 4, y: 0, color: WHITE }],
              caption: 'Trắng thoát sang E9! Không chỉ có thêm khí F9, Trắng còn đặt quân Đen F8 vào thế bị chèn ép.',
              why: 'Nếu Đen đánh F9 để chặn, Trắng vẫn ăn hoặc nối được về G9 — cặp D8-E8 hoàn toàn thoát hiểm.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Cặp Trắng D8-E8 chỉ còn 2 khí. Hãy chọn đúng hướng Atari để cắt đứt đường nối về G9-G8 và bắt trọn cả cụm!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 1]],
          white: [[3, 1], [4, 1], [6, 0], [6, 1]]
        },
        hint: {
          text: 'Chặn phía bên phải (E9) để ép Trắng chạy sang trái đụng vào quân Đen B9.',
          marker: { x: 4, y: 0, type: 'circle' }
        },
        tree: {
          '4,0': {
            status: 'continue',
            reply: [3, 0],
            feedback: 'Đúng hướng! Trắng chạy D9 đụng tường Đen. Hãy đánh C9 để ăn gọn cả 3 quân Trắng!',
            next: {
              '2,0': {
                status: 'solved',
                feedback: 'Tuyệt vời! Bạn đã cắt đường nối viện trợ và bắt trọn 3 quân Trắng!'
              }
            }
          },
          '3,0': {
            status: 'wrong',
            reply: [4, 0],
            feedback: 'Sai hướng! Chiếu từ D9 đẩy Trắng chạy sang E9 hướng về đồng đội G9-G8 và thoát thân.'
          },
          '5,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Lùi F9 quá chậm — Trắng chạy D9 có 2 khí (C9 và E9) và sống sót dễ dàng!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy chiếu từ E9 để ngăn Trắng chạy sang phải nối với G9-G8.'
      }
    },

    // ==================== STAGE 3 (+4 -> 9) ====================
    {
      id: 'lesson-3-6',
      stageId: 'stage-3',
      code: '3.6',
      title: 'Tứ Khúc Góc (Bent Four in the Corner)',
      jpTerm: 'Sumi no Magari-shimoku (Tứ Khúc Góc)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Không gian 4 ô hình chữ L ở góc (Tứ Khúc) không tự động sống như 4 ô thẳng — cần chiếm đúng điểm bẻ góc để tách làm 2 mắt!',
      theoryHtml: `
        <p>Ở giữa bàn hoặc biên, không gian 4 ô chữ L thường dễ tạo 2 mắt. Nhưng riêng <strong>ở góc bàn cờ</strong>, hình <strong>Tứ Khúc (Bent Four)</strong> lại cực kỳ nhạy cảm:</p>
        <ul>
          <li><strong>Điểm sống-chết duy nhất:</strong> Giao điểm nằm ngay góc rẽ trên cạnh ngoài (ô <code>B9</code> trong bài này).</li>
          <li>Nếu bạn chiếm <code>B9</code> trước, không gian còn lại tách hẳn thành 2 mắt riêng biệt: cụm <code>{A9, A8}</code> và ô <code>C9</code> → <strong>Sống 100%</strong>!</li>
          <li>Nếu bạn đánh nhầm ra hai đầu mút (<code>C9</code> hoặc <code>A8</code>), đối phương chiếm <code>B9</code> sẽ ép không gian còn lại thành hình Tam Khúc hoặc L-3 ô chỉ có 1 mắt → <strong>Chết</strong>!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Ghi nhớ:</strong> “Tứ Khúc ở góc là hình cờ phải cảnh giác cao độ — điểm sống luôn nằm ở khúc gãy 1-2!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [3, 0]],
        white: [[0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [4, 1], [4, 0]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: B9 tách 2 mắt',
          summary: 'Đánh B9 chia không gian 4 ô góc thành 2 mắt riêng biệt ({A9,A8} và C9) — Đen sống 100%.',
          steps: [
            {
              caption: 'Đám Đen ở góc trên trái có đúng 4 ô trống hình chữ L: A9, B9, C9 và A8.',
              why: 'Trông có vẻ rộng (4 ô), nhưng nếu đánh sai 1 nước, Trắng sẽ cướp mất yếu điểm ở giữa.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Đen đánh chính xác vào B9 (điểm 1-2 trên cạnh trên)!',
              why: 'B9 chia đôi khu vực: phía trái còn 2 ô (A9, A8) tạo thành 1 mắt lớn; phía phải còn 1 ô (C9) tạo thành 1 mắt riêng. Đen có đủ 2 mắt bất tử!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C9 đánh đầu mút',
          summary: 'Đánh C9 để Trắng chiếm B9 — phần còn lại thu về 2 ô liền nhau không thể tách 2 mắt.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh vào đầu mút C9 để thu gọn không gian.',
              why: 'Đánh ở đầu mút không tạo ra vách ngăn chia đôi vùng trống góc.'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9, chỉ để lại 3 ô liên thông A9-B9-A8.',
              why: 'Đen tưởng rằng còn 3 ô là an toàn, nhưng A9-B9-A8 chỉ tạo thành 1 mắt duy nhất nếu Trắng nhảy vào B9!'
            },
            {
              moves: [{ x: 1, y: 0, color: WHITE }],
              caption: 'Trắng đánh ngay vào B9! Giờ Đen chỉ có thể ăn B9 sau khi tự bịt A9 hoặc A8, cuối cùng chỉ còn 1 mắt → Đen chết toàn bộ!',
              why: 'Bài học kinh điển: điểm 1-2 (B9) là yếu điểm sống còn của hình Tứ Khúc góc.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Đám Đen ở góc trên trái có 4 ô hình chữ L (Tứ Khúc Góc). Hãy đánh vào điểm sống duy nhất để tạo Hai Mắt Thật!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [3, 0]],
          white: [[0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [4, 1], [4, 0]]
        },
        hint: {
          text: 'Tìm giao điểm chia 4 ô chữ L thành hai vùng tách biệt nhau hoàn toàn: B9!',
          marker: { x: 1, y: 0, type: 'circle' }
        },
        tree: {
          '1,0': {
            status: 'solved',
            feedback: 'Chính xác! B9 tách không gian thành 2 mắt riêng biệt ({A9, A8} và C9). Đen sống bất tử!'
          },
          '2,0': {
            status: 'wrong',
            reply: [1, 0],
            feedback: 'Sai! Trắng đánh ngay B9 phá tan mắt thứ hai — cả góc Đen sẽ chết!'
          },
          '0,1': {
            status: 'wrong',
            reply: [1, 0],
            feedback: 'Sai! Trắng đánh B9 khiến A9 và C9 nối chung thành 1 vùng chết — Đen không đủ 2 mắt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm giao điểm chia Tứ Khúc góc thành hai vùng mắt tách rời (B9).'
      }
    },
    {
      id: 'lesson-3-7',
      stageId: 'stage-3',
      code: '3.7',
      title: 'Phá Mắt Nakade: Lục Hoa Mai (Rabbitty Six)',
      jpTerm: 'Hana-rokumoku (Lục Hoa Mai)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Không gian 6 ô hình Hoa Mai có đúng 1 điểm Nakade ở tâm — chiếm được tâm đó là giết sạch đám quân đối phương!',
      theoryHtml: `
        <p>Trong bài 3.4, bạn đã học hình 5 ô Nắm Đấm (Ngũ Quy). Hình 6 ô kế tiếp cực hay gặp ở biên là <strong>Lục Hoa Mai (Rabbitty Six / Flower Six)</strong>:</p>
        <ul>
          <li>Cấu trúc gồm 1 điểm tâm nối với 4 hướng xung quanh + 1 tai góc (tổng cộng 6 giao điểm trống).</li>
          <li><strong>Điểm Nakade duy nhất:</strong> Chính là <strong>điểm tâm</strong> (<code>D8</code> trong bài này).</li>
          <li>Nếu bạn đặt quân vào tâm <code>D8</code> trước, đối phương không thể chia làm 2 mắt. Nếu bạn đánh nhầm ra cánh, đối phương chiếm ngay tâm <code>D8</code> và sống với 2–3 mắt rõ rệt!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Quy tắc:</strong> “Lục Hoa Mai — đánh thẳng vào nhụy hoa (điểm tâm) để héo cả bông!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 3], [6, 2], [6, 1], [6, 0]],
        white: [[1, 0], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [4, 3], [4, 2], [5, 2], [5, 1], [5, 0], [4, 0]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D8 phá nhụy hoa',
          summary: 'Đánh thẳng vào điểm tâm D8 của Lục Hoa Mai khiến Trắng không thể tách làm 2 mắt.',
          steps: [
            {
              caption: 'Đám Trắng ở biên trên có 6 ô trống hình Lục Hoa Mai: C9, D9, C8, D8, E8 và D7.',
              why: 'Trong 6 ô này, D8 là giao điểm duy nhất tiếp giáp với tới 4 ô trống khác (D9, C8, E8, D7).'
            },
            {
              moves: [{ x: 3, y: 1, color: BLACK }],
              caption: 'Đen đánh Nakade vào điểm tâm D8!',
              why: 'Dù Trắng có vây bắt được quân D8 (bằng cách đánh hết các điểm xung quanh), hình dạng còn lại chỉ là Ngũ Quy hoặc 1 mắt duy nhất → toàn bộ đám Trắng chết!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D9 đánh ngoài biên',
          summary: 'Đánh D9 để Trắng chiếm tâm D8 — Trắng tách thành nhiều mắt và sống ngay.',
          steps: [
            {
              caption: 'Xét trường hợp Đen thử thu gọn từ đường 1 bằng nước D9.',
              why: 'Nhiều người thích đánh vào đường 1 trước vì sợ Trắng làm mắt ở biên, nhưng lại bỏ quên điểm tâm!'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh D9, quân D9 không đủ lực chia cắt vùng dưới.',
              why: 'Ngược lại, D9 tự động biến thành mồi để Trắng tạo mắt ở hai bên.'
            },
            {
              moves: [{ x: 3, y: 1, color: WHITE }],
              caption: 'Trắng chiếm ngay D8 (vừa Atari quân D9)!',
              why: 'Với quân Trắng đứng tại D8, Trắng lập tức có 2 mắt tách biệt hoàn toàn: một ở {C9, C8} và một ở E8 / D7 → Trắng sống 100%!'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trắng đang có 6 ô trống hình Lục Hoa Mai (Rabbitty Six). Hãy đánh vào điểm tâm Nakade duy nhất để tiêu diệt toàn bộ đám Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 3], [6, 2], [6, 1], [6, 0]],
          white: [[1, 0], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [4, 3], [4, 2], [5, 2], [5, 1], [5, 0], [4, 0]]
        },
        hint: {
          text: 'Tìm “nhụy hoa” tiếp giáp với cả 4 hướng xung quanh — giao điểm D8!',
          marker: { x: 3, y: 1, type: 'circle' }
        },
        tree: {
          '3,1': {
            status: 'solved',
            feedback: 'Quá chuẩn! Điểm tâm D8 phá tan mọi khả năng tách 2 mắt của Lục Hoa Mai — đám Trắng chết toàn bộ!'
          },
          '3,0': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Sai! Trắng đánh ngay D8 (Atari D9) và tách thành 2 mắt riêng biệt → Trắng sống!'
          },
          '4,1': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Sai! Trắng ăn/chiếm ngay điểm tâm D8 và sống dễ dàng với 2 mắt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy nhớ nguyên tắc: “Lục Hoa Mai đánh thẳng vào điểm tâm D8”.'
      }
    },
    {
      id: 'lesson-3-8',
      stageId: 'stage-3',
      code: '3.8',
      title: 'Tạo Cướp Để Sống (Ko for Life)',
      jpTerm: 'Ko-iki (Cướp Sống)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Khi không thể sống vô điều kiện, đừng đầu hàng — hãy tìm nước ăn Cướp (Ko) để tranh giành cơ hội sống sót!',
      theoryHtml: `
        <p>Trong Tsumego, kết quả không chỉ có “Sống” hay “Chết”, mà còn một kết quả cực kỳ quan trọng thứ ba: <strong>Sống bằng Cướp (Ko for Life)</strong>.</p>
        <ul>
          <li>Khi đối phương đã khóa kín không cho bạn làm mắt thứ 2 một cách trực tiếp, hãy tìm xem có quân địch nào đang chỉ còn <strong>1 khí</strong> ở vị trí có thể mở ra <strong>thế Cướp (Ko)</strong> không.</li>
          <li>Nếu bạn ăn được quân đó để tạo Ko, đối thủ không được ăn trả ngay — họ phải đi <em>Đòi cướp (Ko threat)</em> nơi khác, cho bạn cơ hội thắng Ko hoặc đổi lấy lợi ích lớn ở vùng khác!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Châm ngôn:</strong> “Còn nước còn tát — một ván Cướp (Ko) là cơ hội hồi sinh cả đám quân lớn!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 1], [0, 2], [0, 3], [1, 1], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 3]],
        white: [[3, 2], [4, 1], [4, 3], [5, 2], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E7 mở thế Cướp',
          summary: 'Ăn quân Trắng D7 tại E7 để tạo thế Cướp (Ko), mở đường cho mắt thứ 2 của Đen.',
          steps: [
            {
              caption: 'Đám Đen bên trái hiện mới có 1 mắt thật duy nhất ở B7. Quân Trắng D7 đang bị kẹp và chỉ còn 1 khí tại E7!',
              why: 'Đen không thể làm thêm mắt ở vùng bên trái nữa, nên E7 là cơ hội sống duy nhất.'
            },
            {
              moves: [{ x: 4, y: 2, color: BLACK }],
              caption: 'Đen đánh E7 — ăn 1 quân Trắng D7 và kích hoạt Luật Cướp (Ko)!',
              why: 'Trắng bị cấm ăn trả ngay vào D7 ở nước sau. Nếu Đen thắng cuộc chiến Cướp và nối được ở D7, Đen có ngay mắt thứ 2 (hoặc thoát ra ngoài) và sống sót!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: F8 bỏ lỡ Cướp',
          summary: 'Đánh ra ngoài F8 để Trắng nối ngay vào E7 — Đen mất sạch cơ hội Cướp và chết 100%.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đi một nước bên ngoài tại F8 thay vì ăn Cướp tại E7.',
              why: 'Nếu Đen chần chừ không ăn D7 ngay, đối thủ sẽ lập tức vá kín điểm yếu.'
            },
            {
              moves: [{ x: 5, y: 1, color: BLACK }],
              caption: 'Đen đánh F8, không hề ảnh hưởng tới trạng thái sống-chết của cụm Đen.',
              why: 'Dù Đen đặt thêm quân ở ngoài, cụm Đen bên trong vẫn chỉ có đúng 1 mắt (B7).'
            },
            {
              moves: [{ x: 4, y: 2, color: WHITE }],
              caption: 'Trắng nối chắc chắn ở E7! Toàn bộ đám Đen mất luôn cơ hội đánh Cướp và chết vô điều kiện.',
              why: 'Chỉ chậm 1 nhịp ở điểm Cướp E7, Đen chuyển từ thế “còn cơ hội sống qua Ko” thành “chết sạch”.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Đám Đen mới có 1 mắt ở B7 và không thể sống trực tiếp. Hãy đánh nước ăn Cướp (Ko) để giành cơ hội sống sót!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 1], [0, 2], [0, 3], [1, 1], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 3]],
          white: [[3, 2], [4, 1], [4, 3], [5, 2], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]]
        },
        hint: {
          text: 'Quân Trắng D7 chỉ còn 1 khí ở E7 — ăn vào E7 để mở ra thế Cướp (Ko)!',
          marker: { x: 4, y: 2, type: 'circle' }
        },
        tree: {
          '4,2': {
            status: 'solved',
            feedback: 'Chính xác! Đen ăn D7 tại E7 và mở ra thế Cướp (Ko) để tranh sống — Trắng không được ăn trả ngay vào D7!'
          },
          '5,1': {
            status: 'wrong',
            reply: [4, 2],
            feedback: 'Chậm một nhịp! Trắng nối ngay ở E7, Đen chỉ còn 1 mắt (B7) và chết hoàn toàn.'
          },
          '5,3': {
            status: 'wrong',
            reply: [4, 2],
            feedback: 'Sai! Trắng nối tại E7 chấm dứt hoàn toàn hy vọng đánh Cướp của Đen.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm quân Trắng D7 đang còn 1 khí và ăn vào E7 để tạo thế Cướp (Ko).'
      }
    },
    {
      id: 'lesson-3-9',
      stageId: 'stage-3',
      code: '3.9',
      title: 'Bỏ Quân Tạo Hai Mắt (Sacrifice to Live)',
      jpTerm: 'Sutegoma-iki (Thí quân cầu sống)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Đôi khi một quân bên ngoài đang bị Atari chỉ là mồi nhử — cố cứu 1 quân lẻ đó sẽ làm bạn mất luôn cả đám quân lớn ở góc!',
      theoryHtml: `
        <p>Nghệ thuật <strong>Thí quân (Sacrifice / Sute-ishi)</strong> là ranh giới phân biệt người mới và kỳ thủ trung cấp:</p>
        <ul>
          <li>Khi một quân cắt bên ngoài bị Atari, nhưng khu vực sống chính của bạn (ví dụ Tam Trực 3 ô ở góc) cũng đang cần một nước để hoàn thành 2 mắt — hãy đặt câu hỏi: <strong>“Cứu 1 quân đó quan trọng hơn, hay cứu cả 8 quân sống góc quan trọng hơn?”</strong></li>
          <li><strong>Bỏ nhỏ giữ lớn:</strong> Chấp nhận bỏ 1 quân lẻ để chiếm ngay Yếu Điểm tạo 2 mắt bất tử.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Cách ngôn:</strong> “Tham một quân con, mất cả gia tài — biết bỏ đúng lúc mới là cao thủ!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 1], [1, 1], [2, 1], [3, 1], [3, 0], [0, 3]],
        white: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 1], [4, 0], [1, 3], [1, 4]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: B9 bỏ A6 sống góc',
          summary: 'Chấp nhận hy sinh 1 quân A6 để chiếm ngay điểm B9 tạo 2 mắt bất tử (A9 và C9).',
          steps: [
            {
              caption: 'Quân Đen A6 ở ngoài đang bị Atari (chỉ còn 1 khí A5). Đồng thời, cụm Đen ở góc trên có 3 ô trống Tam Trực (A9, B9, C9).',
              why: 'A6 có cứu cũng chỉ là 1 quân tách rời bên ngoài, trong khi cả đám góc cần điểm B9 để sống.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Đen dứt khoát bỏ A6, đánh thẳng vào B9!',
              why: 'B9 chia không gian Tam Trực thành 2 mắt thật riêng biệt tại A9 và C9. Dù Trắng có ăn mất A6, cả cụm góc Đen vẫn sống bất tử!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: A5 ham cứu 1 quân',
          summary: 'Cố chạy A6 xuống A5 làm mất nhịp góc — Trắng chiếm ngay B9 giết sạch cả đám Đen.',
          steps: [
            {
              caption: 'Xét trường hợp Đen tiếc quân A6 nên vội vàng chạy xuống A5.',
              why: 'Đây là phản xạ “thấy Atari là chạy” rất hay gặp nhưng cực kỳ tai hại khi góc chưa sống.'
            },
            {
              moves: [{ x: 0, y: 4, color: BLACK }],
              caption: 'Đen nối A5 (chỉ cứu được 1 quân chạy ra biên trái yếu ớt), bỏ quên góc trên.',
              why: 'Nhờ nước chạy A5, Trắng được quyền đi trước (Tiên thủ) vào điểm sống của góc Đen.'
            },
            {
              moves: [{ x: 1, y: 0, color: WHITE }],
              caption: 'Trắng đánh ngay vào yếu điểm B9! Tam Trực góc bị phá, toàn bộ 5 quân góc Đen chết sạch!',
              why: 'Đổi 5 quân góc + đất góc chỉ để cứu 1 quân A6 là thương vụ lỗ nặng nhất trên bàn cờ.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Quân A6 đang bị Atari, nhưng đám góc trên vẫn chưa có 2 mắt! Hãy chọn giữ đại cục để cứu sống toàn bộ góc!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 1], [1, 1], [2, 1], [3, 1], [3, 0], [0, 3]],
          white: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 1], [4, 0], [1, 3], [1, 4]]
        },
        hint: {
          text: 'Hãy bỏ mặc quân A6 và đánh ngay vào điểm giữa của 3 ô trống góc trên (B9)!',
          marker: { x: 1, y: 0, type: 'circle' }
        },
        tree: {
          '1,0': {
            status: 'solved',
            feedback: 'Sáng suốt! Bỏ quân lẻ A6 để chiếm điểm B9 giúp cả góc Đen sống bất tử với 2 mắt A9 và C9!'
          },
          '0,4': {
            status: 'wrong',
            reply: [1, 0],
            feedback: 'Tham nhỏ mất lớn! Trong khi bạn lo cứu A6 ở A5, Trắng chiếm ngay B9 giết sạch cả đám góc!'
          },
          '0,0': {
            status: 'wrong',
            reply: [1, 0],
            feedback: 'Đánh lệch sang A9 khiến Trắng chiếm ngay B9 và tiêu diệt toàn bộ góc Đen!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy bảo vệ cả góc bằng nước B9 thay vì cứu 1 quân lẻ ở ngoài.'
      }
    },

    // ==================== STAGE 4 (+3 -> 7) ====================
    {
      id: 'lesson-4-5',
      stageId: 'stage-4',
      code: '4.5',
      title: 'Thủ Cân: Đan Chéo (Wedge / Warikomi)',
      jpTerm: 'Warikomi (Nêm / Đan Chéo)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Nêm thẳng một quân vào khe giữa hai quân địch đứng cách 1 ô (Ikken Tobi) để gây Song Chiếu hoặc chia cắt hoàn toàn.',
      theoryHtml: `
        <p><strong>Đan Chéo / Nêm (Warikomi)</strong> là một trong những Thủ Cân sắc bén nhất khi đối thủ đi bước nhảy 1 ô yếu ớt:</p>
        <ul>
          <li>Khi hai quân địch đứng cách nhau 1 ô (ví dụ <code>C8</code> và <code>E8</code>) nhưng có quân bạn áp sát hai bên làm mất khí của chúng.</li>
          <li>Thay vì đẩy chậm từ phía sau (giúp địch nối liền dễ dàng), bạn <strong>nêm thẳng vào giữa khe hở</strong> (<code>D8</code>)!</li>
          <li>Quân nêm lập tức đe dọa cắt đôi và đặt cả hai quân địch vào thế thiếu khí không cứu nổi cùng lúc.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Cách ngôn:</strong> “Thấy bước nhảy 1 ô thiếu khí — Nêm thẳng vào giữa chia đôi đội hình!”</div>
      `,
      demoInitialPosition: {
        black: [[1, 0], [1, 1], [2, 2], [4, 2], [5, 1], [5, 0]],
        white: [[2, 1], [4, 1]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D8 nêm chia cắt',
          summary: 'Nêm thẳng vào D8 tạo Song Chiếu lên C8 và E8 — Trắng chắc chắn mất 1 quân.',
          steps: [
            {
              caption: 'Hai quân Trắng C8 và E8 đang bị Đen kẹp chặt hai bên và phía dưới (C7, E7), chỉ còn 2 khí mỗi bên.',
              why: 'Cả C8 và E8 đều dùng chung một điểm nối ở chính giữa là D8!'
            },
            {
              moves: [{ x: 3, y: 1, color: BLACK }],
              caption: 'Đen nêm thẳng vào D8 (Warikomi)! Cả C8 lẫn E8 cùng bị Atari cùng lúc (Song Chiếu)!',
              why: 'Bản thân quân D8 vẫn có 2 khí (D9 và D7) nên Trắng không thể ăn ngay D8 mà phải lo cứu 1 trong 2 quân bên cạnh.'
            },
            {
              moves: [{ x: 2, y: 0, color: WHITE }],
              caption: 'Trắng cố cứu quân C8 bằng cách chạy lên C9...',
              why: 'Trắng chỉ cứu được một phía vì quân kia vẫn đang ở trạng thái 1 khí!'
            },
            {
              moves: [{ x: 4, y: 0, color: BLACK }],
              caption: '...thì Đen lập tức ăn gọn quân Trắng E8 tại E9 và liên kết hoàn toàn!',
              why: 'Đòn Warikomi giúp Đen cắt đứt hoàn toàn mặt trận Trắng và thu về 1 tù binh.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D7 đẩy từ sau',
          summary: 'Đẩy ở D7 giúp Trắng bình tĩnh nối liền ở D8 thành khối vững chắc.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đẩy nhẹ nhàng từ dưới lên tại D7.',
              why: 'Nước đẩy từ ngoài không hề tạo ra áp lực cắt ngay lập tức.'
            },
            {
              moves: [{ x: 3, y: 2, color: BLACK }],
              caption: 'Đen đánh D7 để nối tường dưới.',
              why: 'Dù D7 nối tường Đen, nhưng nó lại trao cho Trắng thời gian vá lại điểm yếu ở đường 2.'
            },
            {
              moves: [{ x: 3, y: 1, color: WHITE }],
              caption: 'Trắng nối ngay tại D8! Cả 3 quân Trắng C8-D8-E8 hợp nhất với 3 khí ở biên trên (C9, D9, E9), sống rất khỏe.',
              why: 'Khe hở đã bị vá kín — cơ hội chia cắt của Đen biến mất hoàn toàn.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hai quân Trắng C8 và E8 đang hở khe ở giữa và ít khí. Hãy tung Thủ Cân Đan Chéo (Warikomi) để cắt đôi và bắt một quân Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 0], [1, 1], [2, 2], [4, 2], [5, 1], [5, 0]],
          white: [[2, 1], [4, 1]]
        },
        hint: {
          text: 'Nêm thẳng vào giữa khe C8 và E8 tại giao điểm D8 để Song Chiếu cả hai!',
          marker: { x: 3, y: 1, type: 'circle' }
        },
        tree: {
          '3,1': {
            status: 'continue',
            reply: [2, 0],
            feedback: 'Chính xác! Warikomi Song Chiếu! Trắng phải chạy C9 — hãy ăn ngay quân E8 tại E9!',
            next: {
              '4,0': {
                status: 'solved',
                feedback: 'Tuyệt vời! Bạn đã thực hiện hoàn hảo đòn Đan Chéo (Warikomi)!'
              }
            }
          },
          '3,2': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Đẩy D7 quá hiền! Trắng nối liền ở D8 thành một khối 3 quân khỏe mạnh.'
          },
          '3,0': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Đánh D9 ở đường 1 bị Trắng nối D8 chắc chắn và cắt ngược D9!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy nêm thẳng vào điểm giữa D8 để Song Chiếu cả C8 và E8.'
      }
    },
    {
      id: 'lesson-4-6',
      stageId: 'stage-4',
      code: '4.6',
      title: 'Thủ Cân: Xuyên Gầm Nối Quân (Watari)',
      jpTerm: 'Watari (Luồn dưới đường 1 nối quân)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Khi hai nhóm quân bị chặn phía trên ở đường 2, hãy nhìn xuống đường 1 — nước Xuyên Gầm (Watari) nối liền cả hai cánh cực kỳ lợi hại!',
      theoryHtml: `
        <p><strong>Watari (Xuyên Gầm / Nối dưới)</strong> là đòn nối quân dọc theo đường 1 rất thường gặp ở biên bàn cờ:</p>
        <ul>
          <li>Hai nhóm quân của bạn đứng hai bên bờ (đường 2), ở giữa có 1 quân địch chặn đường trên.</li>
          <li>Nếu bạn đặt quân vào chính giữa ở <strong>đường 1</strong> (<code>D9</code>), đối phương muốn cắt cũng không cắt nổi vì mỗi bên của bạn đều đã có sẵn đồng đội chờ ăn trả!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Mẹo thực chiến:</strong> “Trên không qua được thì luồn dưới gầm — Watari đường 1 vừa nối quân vừa ăn đất biên!”</div>
      `,
      demoInitialPosition: {
        black: [[1, 1], [2, 1], [2, 2], [4, 1], [4, 2], [5, 1]],
        white: [[3, 1], [3, 2], [3, 3]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D9 xuyên gầm',
          summary: 'Đặt quân ở D9 xuyên qua gầm quân Trắng D8; nếu Trắng cắt C9 thì bị ăn ngay tại B9!',
          steps: [
            {
              caption: 'Trắng D8-D7-D6 đang chia cắt hai cánh Đen ở bên trái (C8) và bên phải (E8).',
              why: 'Phía trên đã bị Trắng chắn, nhưng ở đường 1 ngay dưới chân D8 (giao điểm D9) vẫn còn trống.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh D9 (Watari)! Nước này dọa nối với cả C9 lẫn E9.',
              why: 'Trắng không thể ngăn được cả hai bên C9 và E9 cùng lúc!'
            },
            {
              moves: [{ x: 2, y: 0, color: WHITE }],
              caption: 'Nếu Trắng cố chen xuống cắt ở C9 thì quân C9 chỉ còn đúng 1 khí tại B9!',
              why: 'Vì Đen đã có sẵn quân B8-C8 ở bên trái, quân Trắng C9 tự chui đầu vào rọ.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Đen đánh B9 — ăn gọn quân cắt C9 và nối liền hoàn toàn hai cánh quân!',
              why: 'Watari thành công rực rỡ: hai nhóm Đen hợp nhất và ăn thêm 1 tù binh Trắng.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C9 đánh lệch',
          summary: 'Đánh C9 để Trắng nhảy ngay xuống D9 chặn chết đường nối dưới gầm.',
          steps: [
            {
              caption: 'Xét trường hợp Đen nối từ từ ở C9 thay vì đánh chính giữa D9.',
              why: 'Đánh lệch 1 ô ở đường 1 làm mất đi tính chất song đe dọa (Miai).'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9 — chỉ bảo vệ được bên trái nhưng bỏ ngỏ trung điểm D9.',
              why: 'Lúc này Trắng D8 không còn bị vây hai đầu ở đường 1 nữa.'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng lập tức đánh D9! Hai cánh Đen bị chia cắt hoàn toàn và C9 mất luôn giá trị nối.',
              why: 'Trong thế Watari, luôn phải đánh chính giữa D9 ngay bên dưới quân địch để giữ hai phương án nối C9 và E9!'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy thực hiện đòn Xuyên Gầm (Watari) nối liền hai cánh Đen bên dưới quân Trắng D8, rồi trừng phạt nếu Trắng dám cắt!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 1], [2, 1], [2, 2], [4, 1], [4, 2], [5, 1]],
          white: [[3, 1], [3, 2], [3, 3]]
        },
        hint: {
          text: 'Đánh thẳng vào đường 1 ngay bên dưới quân Trắng D8 — giao điểm D9!',
          marker: { x: 3, y: 0, type: 'circle' }
        },
        tree: {
          '3,0': {
            status: 'continue',
            reply: [2, 0],
            feedback: 'Chuẩn Watari! Trắng liều lĩnh cắt ở C9 — hãy đánh B9 để ăn gọn quân cắt và nối liền!',
            next: {
              '1,0': {
                status: 'solved',
                feedback: 'Xuất sắc! Bạn đã xuyên gầm nối liền hai cánh quân và bắt gọn quân cắt của Trắng!'
              }
            }
          },
          '2,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Sai! Đánh lệch sang C9 để Trắng chặn ngay D9 và cắt đứt hai cánh Đen.'
          },
          '4,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Sai! Đánh lệch sang E9 để Trắng chặn ngay D9 và cô lập hoàn toàn hai nhóm Đen.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy đánh chính giữa đường 1 ngay dưới chân D8 (giao điểm D9).'
      }
    },
    {
      id: 'lesson-4-7',
      stageId: 'stage-4',
      code: '4.7',
      title: 'Thủ Cân: Chụp Mũ Tấn Công (Cap / Boshi)',
      jpTerm: 'Boshi (Chụp Mũ)',
      difficulty: 'Trung cấp',
      boardSize: 13,
      summary: 'Khi quân địch đứng lẻ ở đường 4, nước Chụp Mũ (cách 1 ô phía trên hướng trung tâm) vừa kìm chân địch vừa xây tường thế lực cực đẹp.',
      theoryHtml: `
        <p><strong>Chụp Mũ (Cap / Boshi)</strong> là một nước tấn công thanh thoát cực kỳ phổ biến ở trình độ từ Trung cấp trở lên:</p>
        <ul>
          <li>Thay vì <strong>chạm sát (Attach)</strong> vào quân yếu của đối thủ (vô tình giúp đối thủ cứng cáp hơn vì có chỗ dựa để phản công), bạn đánh <strong>cách 1 ô phía trên đầu nó</strong> hướng ra trung tâm.</li>
          <li><strong>Hiệu quả kép:</strong> Nếu địch chạy sang trái hoặc phải ở biên, tường của bạn ở giữa bàn trở nên cực kỳ dày dặn để áp đảo toàn bộ khu vực xung quanh!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Châm ngôn vàng:</strong> “Không bao giờ chạm sát vào quân yếu của địch — hãy Chụp Mũ từ xa để ép nó bò sát đất!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 3], [9, 3], [3, 9], [9, 9], [6, 9]],
        white: [[6, 3], [9, 6], [3, 6]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: G8 chụp mũ',
          summary: 'Đánh G8 cách 1 ô trên đầu G10 — ép Trắng xuống thấp đồng thời nối với thế trận G4 ở dưới.',
          steps: [
            {
              caption: 'Trên bàn 13×13, quân Trắng G10 đang đứng cô đơn giữa hai điểm Sao mạnh của Đen (D10 và K10).',
              why: 'G10 là một quân yếu đang bị kẹp hai đầu — Đen cần tấn công mà không giúp nó mạnh lên.'
            },
            {
              moves: [{ x: 6, y: 5, color: BLACK }],
              caption: 'Đen chụp mũ tại G8 (cách G10 một ô hướng vào tâm)!',
              why: 'G8 khóa đường tiến ra trung tâm của Trắng, phối hợp ăn ý với quân Đen G4 ở dưới và giữ áp lực đều lên cả hai hướng chạy của G10.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: G9 chạm sát',
          summary: 'Chạm sát G9 vô tình giúp quân yếu G10 được Bẻ đầu và có chỗ dựa sống dễ dàng.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh chạm sát vào đầu G10 tại G9.',
              why: 'Người mới rất hay chạm sát để “đánh nhau” với quân yếu, nhưng đây lại là điều quân yếu mong muốn nhất.'
            },
            {
              moves: [{ x: 6, y: 4, color: BLACK }],
              caption: 'Đen đánh G9 chạm sát G10.',
              why: 'G9 cho Trắng điểm tựa vững chắc ngay bên cạnh để bẻ đầu hoặc cắt trả.'
            },
            {
              moves: [{ x: 5, y: 4, color: WHITE }],
              caption: 'Trắng bẻ đầu ngay tại F9! Trắng nhanh chóng tăng khí, đứng thẳng lưng ra trung tâm và thoát khỏi thế bị vây.',
              why: 'Chạm vào quân yếu là giúp quân yếu mạnh lên. Hãy luôn nhớ đòn Chụp Mũ cách 1 ô (G8)!'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Bàn 13×13): Quân Trắng G10 đang bị kẹp giữa hai góc Đen. Đừng chạm sát! Hãy dùng đòn Chụp Mũ (Cap) để khóa hướng trung tâm của G10!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 3], [9, 3], [3, 9], [9, 9], [6, 9]],
          white: [[6, 3], [9, 6], [3, 6]]
        },
        hint: {
          text: 'Từ G10 nhảy vào trung tâm bỏ trống 1 ô — đó là giao điểm G8!',
          marker: { x: 6, y: 5, type: 'circle' }
        },
        tree: {
          '6,5': {
            status: 'solved',
            feedback: 'Tuyệt vời! Nước Chụp Mũ G8 giữ áp lực tuyệt đối lên G10 mà không cho Trắng điểm tựa phản công!'
          },
          '6,4': {
            status: 'wrong',
            reply: [5, 4],
            feedback: 'Chạm sát G9 quá nặng! Trắng bẻ đầu F9 đứng vững ngay lập tức và thoát khỏi vòng kẹp.'
          },
          '6,2': {
            status: 'wrong',
            reply: [6, 4],
            feedback: 'Chạm từ phía biên G11 càng giúp Trắng nhảy thẳng ra trung tâm G9 cực kỳ thoải mái!'
          }
        },
        defaultWrongFeedback: 'Chưa chuẩn chiến lược! Hãy đánh Chụp Mũ cách 1 ô phía trên G10 tại giao điểm G8.'
      }
    },

    // ==================== STAGE 5 (+3 -> 6) ====================
    {
      id: 'lesson-5-4',
      stageId: 'stage-5',
      code: '5.4',
      title: 'Định Thức Tiểu Mục: Đóng Góc (Shimari)',
      jpTerm: 'Komoku Shimari (Đóng góc 3-4)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 8, maxX: 18, minY: 0, maxY: 10 },
      summary: 'Khi giữ quân Tiểu Mục (3-4), nước Đóng Góc (Keima hoặc Ogeima) biến góc thành pháo đài đất cực lớn ngay trong khai cuộc.',
      theoryHtml: `
        <p>Quân <strong>Tiểu Mục (3-4 / Komoku)</strong> có ưu điểm là hướng về một cạnh rõ rệt. Nếu đối phương chưa tiếp cận góc đó, bạn nên thực hiện nước <strong>Đóng Góc (Shimari)</strong>:</p>
        <ul>
          <li><strong>Đóng Góc Mã (Keima Shimari - <code>O16</code>):</strong> Chắc chắn nhất, bảo vệ đất góc (~15+ điểm) và hầu như không có điểm yếu xâm nhập 3-3.</li>
          <li><strong>Đóng Góc Đại Mã (Ogeima Shimari - <code>N16</code>):</strong> Rộng hơn và hướng biên tốt hơn, rất hợp xu hướng AI hiện đại.</li>
          <li><strong>Tránh:</strong> Đi quá hẹp sát tường (<code>P17</code> — dễ bị chèn ép từ ngoài) hoặc đi đường 2 quá thấp (<code>R18</code>).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khai cuộc:</strong> “Một nước Đóng Góc tốt có giá trị ngang một góc mới!”</div>
      `,
      demoInitialPosition: {
        black: [[15, 2], [3, 15], [15, 15]],
        white: [[3, 3], [15, 16], [2, 13]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: O16 đóng góc Mã',
          summary: 'Đóng góc bằng nước Mã (Keima) ở O16 — bảo vệ kín góc và hướng ảnh hưởng ra biên trên.',
          steps: [
            {
              caption: 'Đen đang giữ Tiểu Mục Q17 (3-4) ở góc trên phải. Hai góc dưới đã có giao tranh xong xuôi.',
              why: 'Góc trên phải là vùng chiến lược lớn nhất còn lại trên bàn cờ.'
            },
            {
              moves: [{ x: 13, y: 3, color: BLACK }],
              caption: 'Đen đóng góc Keima tại O16!',
              why: 'O16 (chếch 2 ô sang trái, 1 ô xuống dưới từ Q17) tạo thành “ngôi nhà” vững chắc bậc nhất lịch sử cờ vây: vừa giữ chặt đất góc, vừa khống chế biên trên!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: P17 nối quá hẹp',
          summary: 'Nối sát P17 quá chậm chạp (gọi là tập trung quá mức / Overconcentrated), để Trắng ép đầu O15.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đi nối thẳng P17 ngay bên cạnh Q17.',
              why: 'Người mới sợ bị cắt nên hay đánh sát vào quân mình ở đường 3.'
            },
            {
              moves: [{ x: 14, y: 2, color: BLACK }],
              caption: 'Đen đánh P17 — hai quân dính sát vào nhau trên đường 3, rất chật chội.',
              why: 'Vùng ảnh hưởng không mở ra được bao nhiêu trong khi góc vẫn hở sườn phía dưới.'
            },
            {
              moves: [{ x: 13, y: 4, color: WHITE }],
              caption: 'Trắng đánh ngay O15 ép vào đầu hai quân Đen!',
              why: 'Nước P17 quá chậm khiến Đen mất luôn quyền phát triển biên trên lẫn trung tâm.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Bàn 19×19): Hãy thực hiện nước Đóng Góc chuẩn mực (Keima Shimari O16 hoặc Ogeima N16) cho quân Tiểu Mục Q17!',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 2], [3, 15], [15, 15]],
          white: [[3, 3], [15, 16], [2, 13]]
        },
        hint: {
          text: 'Từ Q17 đi sang trái 2 ô, xuống dưới 1 ô (nước Mã Keima) — giao điểm O16!',
          marker: { x: 13, y: 3, type: 'circle' }
        },
        tree: {
          '13,3': {
            status: 'solved',
            feedback: 'Chính xác! Keima Shimari (O16) là nước đóng góc mẫu mực nhất, bảo vệ kín góc và mở rộng thế trận biên trên.'
          },
          '12,3': {
            status: 'solved',
            feedback: 'Tuyệt vời! Ogeima Shimari (N16) cũng là nước đóng góc rất được AI ưa chuộng để kiểm soát rộng biên trên.'
          },
          '14,2': {
            status: 'wrong',
            reply: [13, 4],
            feedback: 'P17 quá hẹp và chậm! Trắng ép ngay O15 kìm hãm toàn bộ góc trên phải của Đen.'
          },
          '16,1': {
            status: 'wrong',
            reply: [13, 3],
            feedback: 'Đánh đường 2 (R18) quá thấp! Trắng chiếm ngay điểm O16 khóa chặt đầu góc Đen.'
          }
        },
        defaultWrongFeedback: 'Chưa tối ưu! Hãy dùng nước Mã O16 (hoặc Đại Mã N16) để đóng góc Tiểu Mục Q17.'
      }
    },
    {
      id: 'lesson-5-5',
      stageId: 'stage-5',
      code: '5.5',
      title: 'Mở Rộng Từ Tường (Tường 2 Quân Mở 3 Ô)',
      jpTerm: 'Tate-ni-nobi / Hiraki (Nguyên tắc Tường 2 mở 3)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 6, maxX: 18, minY: 0, maxY: 10 },
      summary: '“Đứng một mình mở 2 ô, dựng tường 2 quân mở 3 ô, tường 3 quân mở 4 ô” — công thức vàng định khoảng cách mở rộng biên!',
      theoryHtml: `
        <p>Một bức tường quân mạnh (<em>Atsumi</em>) không tự nó tạo ra điểm — bạn phải <strong>mở rộng ra biên</strong> ở khoảng cách chuẩn xác để biến sức mạnh thành đất:</p>
        <ul>
          <li><strong>Quy tắc n+1 (Tường n quân → mở n+1 ô trống ở giữa):</strong></li>
          <li>1 quân → mở cách <strong>2 ô</strong>; <strong>Tường 2 quân → mở cách 3 ô</strong> (từ cột Q sang cột M); Tường 3 quân → mở cách 4 ô.</li>
          <li><strong>Nếu mở quá gần (2 ô):</strong> Bị <em>Tập trung quá mức (Overconcentrated)</em>, lãng phí sức mạnh bức tường.</li>
          <li><strong>Nếu mở quá xa (4–5 ô):</strong> Dễ bị đối thủ <em>Đả nhập</em> thẳng vào giữa chia cắt!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Tường càng dày càng phải đứng xa để phát huy tối đa tầm ảnh hưởng!”</div>
      `,
      demoInitialPosition: {
        black: [[15, 3], [15, 4], [3, 15]],
        white: [[16, 2], [16, 3], [16, 4], [3, 3], [15, 15]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: M16 mở đúng 3 ô',
          summary: 'Tường 2 quân Q16-Q15 mở rộng cách 3 ô sang M16 (hoặc M17) — khoảng cách hoàn hảo!',
          steps: [
            {
              caption: 'Đen đang có bức tường 2 quân Q16-Q15 cực kỳ vững chắc hướng về biên trên.',
              why: 'Theo công thức “Tường 2 quân mở cách 3 ô”, Đen cần đếm bỏ trống 3 cột (P, O, N) và đặt quân ở cột M.'
            },
            {
              moves: [{ x: 11, y: 3, color: BLACK }],
              caption: 'Đen mở rộng sang M16 (bỏ trống 3 cột P, O, N ở giữa)!',
              why: 'M16 vừa liên kết an toàn với tường Q16-Q15 (nếu Trắng chui vào giữa sẽ bị tường Đen đánh tơi tả), vừa tạo khung đất rộng lớn dọc biên trên!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: O16 quá gần',
          summary: 'Đứng quá gần O16 lãng phí bức tường dày; Trắng chiếm K17 hạn chế hoàn toàn tiềm năng biên trên.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh nhát tay, chỉ mở cách 1 ô tại O16.',
              why: 'Người mới thường sợ bị đả nhập nên đặt quân rất gần tường của mình.'
            },
            {
              moves: [{ x: 13, y: 3, color: BLACK }],
              caption: 'Đen đánh O16 — ba quân Đen túm tụm ở cột Q-O trong khi Trắng vốn chẳng thể sống nổi ở đó.',
              why: 'Hiện tượng này gọi là “Tập trung quá mức” (Overconcentration): tốn nước đi vào vùng vốn đã thuộc kiểm soát.'
            },
            {
              moves: [{ x: 9, y: 2, color: WHITE }],
              caption: 'Trắng nhẹ nhàng nhảy vào K17 chặn đầu biên trên!',
              why: 'Đen không xây được khung đất lớn như khi mở đúng chuẩn M16/M17.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Bàn 19×19): Đen có tường 2 quân Q16-Q15. Hãy áp dụng công thức “Tường 2 quân mở cách 3 ô” để mở rộng chuẩn xác dọc biên trên!',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 3], [15, 4], [3, 15]],
          white: [[16, 2], [16, 3], [16, 4], [3, 3], [15, 15]]
        },
        hint: {
          text: 'Từ cột Q đếm bỏ trống 3 cột (P, O, N) sang trái → cột M (M16 hoặc M17)!',
          marker: { x: 11, y: 3, type: 'circle' }
        },
        tree: {
          '11,3': {
            status: 'solved',
            feedback: 'Chuẩn xác! Tường 2 quân Q16-Q15 mở cách 3 ô tới M16 phát huy tối đa sức mạnh của bức tường!'
          },
          '11,2': {
            status: 'solved',
            feedback: 'Rất tốt! Mở cách 3 ô trên đường 3 tại M17 cũng chắc đất và chuẩn xác!'
          },
          '13,3': {
            status: 'wrong',
            reply: [9, 2],
            feedback: 'Quá gần (Overconcentrated)! O16 lãng phí sức mạnh bức tường 2 quân, để Trắng thoải mái chặn ở K17.'
          },
          '9,3': {
            status: 'wrong',
            reply: [12, 2],
            feedback: 'Quá xa (mở 5 ô)! K16 để hở khoảng trống quá lớn — Trắng đả nhập thẳng vào N17 chia cắt ngay lập tức.'
          }
        },
        defaultWrongFeedback: 'Chưa chuẩn khoảng cách! Tường 2 quân ở cột Q nên mở cách 3 ô sang cột M (M16 hoặc M17).'
      }
    },
    {
      id: 'lesson-5-6',
      stageId: 'stage-5',
      code: '5.6',
      title: 'Kẹp Tấn Công (Hasami / Pincer)',
      jpTerm: 'Hasami (Kẹp)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 6, maxX: 18, minY: 0, maxY: 10 },
      summary: 'Khi có sẵn đồng đội đón đầu ở biên trên, thay vì đỡ góc thụ động, hãy Kẹp (Pincer) quân tiếp cận của địch vào giữa gọng kìm!',
      theoryHtml: `
        <p>Trong bài 5.3, bạn đã học cách đỡ góc hòa bình (<em>Keima</em>) khi biên trên còn trống. Nhưng khi <strong>bạn đã có sẵn một quân hỗ trợ trên biên</strong> (như <code>K17</code> trong bài này):</p>
        <ul>
          <li>Nếu bạn đỡ góc thụ động ở cạnh phải, đối thủ sẽ nhảy 2 ô sang <code>L17</code> ngay trước mặt quân <code>K17</code> của bạn và ổn định dễ dàng.</li>
          <li>Thay vào đó, hãy đánh nước <strong>Kẹp (Hasami / Pincer)</strong> ở <code>M17</code> hoặc <code>M16</code>! Quân địch <code>O17</code> bị kẹp cứng giữa <code>Q16</code>, <code>M17</code> và <code>K17</code> — rơi vào thế chạy trốn vất vả!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Nguyên tắc khai cuộc:</strong> “Có đồng đội chờ sẵn trên biên → Kẹp ngay không cần do dự!”</div>
      `,
      demoInitialPosition: {
        black: [[15, 3], [9, 2], [3, 15]],
        white: [[13, 2], [3, 3], [15, 15]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: M17 kẹp gọng kìm',
          summary: 'Kẹp vào M17 để khóa đường mở căn cứ của O17, biến quân Trắng thành quân yếu bị bao vây.',
          steps: [
            {
              caption: 'Trắng tiếp cận góc Sao Q16 bằng nước Mã O17 — nhưng Trắng quên rằng Đen đã có sẵn quân K17 đứng chờ ở biên trên!',
              why: 'Một quân không có căn cứ 2 khoảng trống dọc biên rất khó làm 2 mắt sống.'
            },
            {
              moves: [{ x: 11, y: 2, color: BLACK }],
              caption: 'Đen tung đòn Kẹp (Hasami) ngay tại M17 (hoặc M16)!',
              why: 'M17 nằm gọn giữa O17 và K17: Trắng O17 bị cô lập không mở được căn cứ sống trên biên và buộc phải chạy ra trung tâm dưới hỏa lực của cả 3 quân Đen!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: R14 đỡ góc thụ động',
          summary: 'Đỡ góc R14 quá hiền để Trắng nhảy sang M17 ổn định căn cứ sống ngay lập tức.',
          steps: [
            {
              caption: 'Xét trường hợp Đen máy móc đỡ góc R14 như bài 5.3 mà quên nhìn quân K17.',
              why: 'Đánh Joseki máy móc không nhìn toàn bàn là lỗi rất hay gặp khi lên Dan.'
            },
            {
              moves: [{ x: 16, y: 5, color: BLACK }],
              caption: 'Đen đỡ bình tĩnh ở R14 giữ đất góc phải.',
              why: 'Nước này giúp Đen chắc góc nhưng lại thả hoàn toàn biên trên cho Trắng.'
            },
            {
              moves: [{ x: 11, y: 2, color: WHITE }],
              caption: 'Trắng lập tức nhảy sang M17! Trắng có căn cứ sống vững vàng và đồng thời làm suy yếu luôn quân Đen K17!',
              why: 'Điểm M17 là điểm trọng yếu cả hai bên cùng muốn (Miai): Đen không Kẹp ở M17 thì Trắng sẽ chiếm M17.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Bàn 19×19): Trắng O17 tiếp cận góc khi Đen đã có sẵn quân K17 ở biên trên! Đừng đỡ góc thụ động — hãy Kẹp (Hasami) ngay!',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 3], [9, 2], [3, 15]],
          white: [[13, 2], [3, 3], [15, 15]]
        },
        hint: {
          text: 'Hãy kẹp cách O17 một ô sang trái tại M17 (hoặc M16) để cô lập O17!',
          marker: { x: 11, y: 2, type: 'circle' }
        },
        tree: {
          '11,2': {
            status: 'solved',
            feedback: 'Chính xác! Nước Kẹp M17 cô lập hoàn toàn quân Trắng O17 giữa gọng kìm Q16 – M17 – K17!'
          },
          '11,3': {
            status: 'solved',
            feedback: 'Rất hay! Nước Kẹp cao M16 vừa tấn công O17 vừa tạo thế ảnh hưởng mạnh hướng ra trung tâm.'
          },
          '16,5': {
            status: 'wrong',
            reply: [11, 2],
            feedback: 'Quá hiền! Trắng chiếm ngay điểm M17 tạo căn cứ sống vững chắc và quay lại gây áp lực lên K17.'
          },
          '13,3': {
            status: 'wrong',
            reply: [14, 2],
            feedback: 'Chạm sát O16 giúp Trắng bẻ P17 lấy góc dễ dàng mà không hề gặp khó khăn!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Khi có quân K17 đón sẵn, hãy Kẹp tại M17 hoặc M16.'
      }
    },

    // ==================== STAGE 6 (+2 -> 4) ====================
    {
      id: 'lesson-6-3',
      stageId: 'stage-6',
      code: '6.3',
      title: 'Chiến Thuật Sabaki (Tạo Hình Dẻo Dai)',
      jpTerm: 'Sabaki (Xử lý nhẹ & dẻo dai)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 7, maxX: 18, minY: 2, maxY: 16 },
      summary: 'Khi một quân lẻ lạc vào vùng tường dày của đối thủ, đừng cố chạy nặng nề — hãy chạm nhẹ vào quân địch để lấy hình dẻo dai hoặc thí quân giữ thế!',
      theoryHtml: `
        <p><strong>Sabaki</strong> là khái niệm đỉnh cao của trung cuộc Cờ Vây: xử lý một nhóm quân mỏng manh trong vòng vây địch một cách <strong>nhẹ nhàng, linh hoạt</strong> (sẵn sàng bỏ quân nếu cần) để tạo 2 mắt hoặc chuyển sang thế lực bên ngoài:</p>
        <ul>
          <li><strong>Nguyên tắc Sabaki:</strong> Khi bạn đã ở trong vùng đất dày của đối phương, hãy <strong>chạm nhẹ (Tsuke / Attach)</strong> vào chính quân của đối phương để mượn lực tạo hình (Miệng Hổ, Bẻ, Cắt) và giành quyền đi trước (<em>Aji</em>).</li>
          <li><strong>Sai lầm cần tránh:</strong> Tự bò ra giữa hoặc đánh nặng nề từng quân một (tạo thành “gậy nặng” không có mắt để đối thủ đuổi đánh khắp bàn cờ).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Triết lý Sabaki:</strong> “Trong vòng vây địch, hãy đánh chạm để tạo hình nhanh — nhẹ như lông hồng, linh hoạt như nước!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 3], [3, 15], [13, 9]],
        white: [[15, 3], [15, 9], [15, 15], [10, 3], [10, 15]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: Q11 chạm nhẹ Sabaki',
          summary: 'Chạm nhẹ Q11 vào vai trên của Q10, khi Trắng lùi P11 thì Đen bẻ Q12 tạo hình linh hoạt!',
          steps: [
            {
              caption: 'Quân Đen O10 đang đứng cô đơn trước bức tường khổng lồ của Trắng bên biên phải (Q16 – Q10 – Q4).',
              why: 'Nếu Đen chỉ chạy O10 ra giữa, Trắng sẽ chụp mũ và biến toàn bộ biên phải thành đất khổng lồ.'
            },
            {
              moves: [{ x: 15, y: 8, color: BLACK }],
              caption: 'Đen đánh chạm (Tsuke) vào đầu Q10 tại Q11!',
              why: 'Đây là thủ pháp Sabaki mẫu mực: chạm vào quân địch để ép đối phương bộc lộ hướng đánh rồi xoay chuyển linh hoạt.'
            },
            {
              moves: [{ x: 14, y: 8, color: WHITE }],
              caption: 'Trắng chặn ngang P11 để tách Đen khỏi biên...',
              why: 'Trắng muốn chặn Đen mở rộng lên phía trên.'
            },
            {
              moves: [{ x: 15, y: 7, color: BLACK }],
              caption: 'Đen bẻ lên Q12! Đen vừa giữ được hình cờ nhẹ nhàng dọc biên phải, vừa để lại nhiều điểm cắt Aji phía P11.',
              why: 'Nhóm Đen có thể sống linh hoạt tại chỗ hoặc sẵn sàng thí O10 nếu Trắng tham lam ăn ở giữa.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: O9 bò nặng nề',
          summary: 'Tự nối dài O9 không chạm địch là nước đi nặng nề, giúp Trắng tấn công N10 dễ dàng.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh O9 (nối dài xuống dưới một cách nặng nề).',
              why: 'Tự đẩy một hàng quân sát nhau giữa vùng địch mà không tạo được mắt gọi là “làm gậy nặng”.'
            },
            {
              moves: [{ x: 13, y: 10, color: BLACK }],
              caption: 'Đen đánh O9 — hai quân O10-O9 vẫn chưa có mắt nào và đứng ngay trước mặt tường Trắng.',
              why: 'Trắng không bị đe dọa cắt hay mất đất biên gì cả.'
            },
            {
              moves: [{ x: 12, y: 9, color: WHITE }],
              caption: 'Trắng nhẹ nhàng nhảy ép N10 từ phía trung tâm! Đen biến thành con mồi chạy trốn nặng nề còn Trắng vừa lấy trung tâm vừa giữ sạch biên phải.',
              why: 'Sabaki cần chạm Q11 để mượn thế từ Trắng, không phải tự co cụm ở O9.'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Bàn 19×19): Quân Đen O10 đang đơn độc trước tường Trắng. Hãy dùng thủ pháp Sabaki chạm nhẹ vào Q11, rồi bẻ Q12 tạo hình dẻo dai!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 3], [3, 15], [13, 9]],
          white: [[15, 3], [15, 9], [15, 15], [10, 3], [10, 15]]
        },
        hint: {
          text: 'Chạm trực tiếp ngay phía trên quân Trắng Q10 tại giao điểm Q11!',
          marker: { x: 15, y: 8, type: 'circle' }
        },
        tree: {
          '15,8': {
            status: 'continue',
            reply: [14, 8],
            feedback: 'Hay lắm! Trắng đỡ P11. Hãy bẻ lên Q12 để hoàn thiện thế Sabaki dẻo dai!',
            next: {
              '15,7': {
                status: 'solved',
                feedback: 'Tuyệt vời! Nước chạm Q11 → bẻ Q12 giúp Đen xoay xở cực kỳ linh hoạt ngay trong lòng địch!'
              }
            }
          },
          '13,10': {
            status: 'wrong',
            reply: [12, 9],
            feedback: 'Quá nặng nề! O9 biến Đen thành đám quân không mắt bị Trắng ép N10 và đuổi đánh.'
          },
          '16,6': {
            status: 'wrong',
            reply: [14, 7],
            feedback: 'Nhảy sâu R13 rời rạc quá nguy hiểm — Trắng chụp mũ P12 cô lập hoàn toàn quân R13!'
          }
        },
        defaultWrongFeedback: 'Chưa chuẩn Sabaki! Hãy chạm trực tiếp vào Q11 để tạo thế linh hoạt.'
      }
    },
    {
      id: 'lesson-6-4',
      stageId: 'stage-6',
      code: '6.4',
      title: 'Thu Quan Đường 1: Bẻ Nối Tiên Thủ',
      jpTerm: 'Sente Hane-Tsugi (Bẻ nối đường 1 tiên thủ)',
      difficulty: 'Nâng cao',
      boardSize: 9,
      summary: 'Trong Thu Quan (Yose), luôn kiểm tra nước Bẻ (Hane) đường 1 để ép đối thủ đỡ và nối về trong Tiên thủ — lời hơn hẳn 2 điểm so với đánh hiền!',
      theoryHtml: `
        <p>Kỹ thuật Thu Quan quan trọng bậc nhất ở đường 1 mà mọi kỳ thủ cần thuộc lòng là <strong>Bẻ Nối Đường 1 (First-line Hane-Tsugi)</strong>:</p>
        <ul>
          <li>Khi hai bức tường đứng đối mặt ở cạnh bàn cờ và đầu đường 1 còn mở (ví dụ cột E và cột F).</li>
          <li><strong>Nước đúng (Tiên thủ - Sente):</strong> Bẻ sang sân đối phương ở <code>F9</code>! Nước này đe dọa đánh tiếp <code>G9</code> phá tung đất góc của địch, buộc địch phải đỡ <code>G9</code> — sau đó bạn nối về <code>E9</code>.</li>
          <li><strong>Nước sai (Hậu thủ - Gote):</strong> Tự nối thụ động ở <code>E9</code> ngay từ đầu → mất trắng cơ hội ép <code>F9</code> và mất luôn Tiên thủ!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Thu quan:</strong> “Đừng tự bảo vệ ở E9 khi bạn có thể Bẻ F9 trong Tiên thủ!”</div>
      `,
      demoInitialPosition: {
        black: [[4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [3, 1], [3, 2]],
        white: [[5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [6, 1], [6, 2]]
      },
      demoSteps: [],
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: F9 bẻ nối Tiên thủ',
          summary: 'Bẻ sang F9 buộc Trắng đỡ G9, sau đó nối E9 — lời 2 điểm so với đánh hiền E9!',
          steps: [
            {
              caption: 'Biên giới giữa Đen (cột E) và Trắng (cột F) đã chia xong, chỉ còn duy nhất khu vực đường 1 ở phía trên (E9, F9).',
              why: 'Chú ý hai quân Đen D8 và Trắng G8 đứng cân xứng ở đường 2, nên cả hai bên đều có điểm yếu ở đường 1.'
            },
            {
              moves: [{ x: 5, y: 0, color: BLACK }],
              caption: 'Đen bẻ thẳng sang F9 (Hane đường 1)!',
              why: 'F9 đặt quân Trắng F8 vào nguy cơ bị cắt ở G9. Nếu Trắng không đỡ ở G9, Đen sẽ tràn sang G9 phá sạch đất góc phải của Trắng!'
            },
            {
              moves: [{ x: 6, y: 0, color: WHITE }],
              caption: 'Trắng buộc phải lùi về đỡ ở G9 — giữ F9 ở trạng thái bị Atari.',
              why: 'Đen đang ép Trắng đi nước phòng thủ thụ động.'
            },
            {
              moves: [{ x: 4, y: 0, color: BLACK }],
              caption: 'Đen nối chắc tại E9! Đen giữ sạch ô E9 và thu hẹp thêm 1 điểm của Trắng (tổng chênh lệch 2 điểm so với đánh E9 trước).',
              why: 'Đó là sức mạnh của nước Bẻ Nối Đường 1 (Hane-Tsugi): luôn bẻ trước rồi mới nối!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: E9 lùi thụ động',
          summary: 'Tự lùi E9 ngay từ đầu để Trắng bẻ ngược lại E9/F9 — Đen mất 2 điểm Thu Quan quý giá.',
          steps: [
            {
              caption: 'Xét trường hợp Đen ngại va chạm nên lùi về nối ngay tại E9.',
              why: 'Người mới thường tưởng đánh E9 là giữ chắc biên giới cột E.'
            },
            {
              moves: [{ x: 4, y: 0, color: BLACK }],
              caption: 'Đen đánh E9 (Hậu thủ hoàn toàn).',
              why: 'Nước này không tạo ra bất kỳ mối đe dọa nào lên đất Trắng.'
            },
            {
              moves: [{ x: 5, y: 0, color: WHITE }],
              caption: 'Trắng chỉ việc đỡ nhẹ F9 và giữ nguyên toàn bộ ô G9 làm đất!',
              why: 'So sánh với nhánh Tốt: Trắng lời hơn 1 ô đất (G9) và còn không bị ép (hoặc nếu Trắng đi trước chỗ này, Trắng mới là người bẻ E9!).'
            }
          ]
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Thu Quan): Hãy thực hiện đòn Bẻ Nối Đường 1 (Hane-Tsugi) ở biên trên để thu quan tối đa thay vì lùi thụ động!',
        playerColor: BLACK,
        initialPosition: {
          black: [[4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [3, 1], [3, 2]],
          white: [[5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [6, 1], [6, 2]]
        },
        hint: {
          text: 'Bẻ sang F9 trước để đe dọa G9, rồi mới nối về E9!',
          marker: { x: 5, y: 0, type: 'circle' }
        },
        tree: {
          '5,0': {
            status: 'continue',
            reply: [6, 0],
            feedback: 'Chính xác! Trắng buộc phải đỡ G9. Giờ hãy nối về E9 để hoàn tất đòn Bẻ Nối!',
            next: {
              '4,0': {
                status: 'solved',
                feedback: 'Tuyệt vời! Bạn đã thực hiện hoàn hảo đòn Thu Quan Bẻ Nối Đường 1 (Hane-Tsugi)!'
              }
            }
          },
          '4,0': {
            status: 'wrong',
            reply: [5, 0],
            feedback: 'Quá hiền! Đánh E9 giúp Trắng giữ nguyên G9 bằng nước F9 — bạn vừa mất oan 2 điểm thu quan!'
          },
          '2,0': {
            status: 'wrong',
            reply: [4, 0],
            feedback: 'Tự đánh vào đất nhà C9! Trắng chiếm ngay E9 và ăn ngược vào góc trái của Đen.'
          }
        },
        defaultWrongFeedback: 'Chưa tối ưu! Hãy bẻ sang F9 trước khi nối về E9.'
      }
    }
  ];

  // Rich Good/Bad Step-by-Step Analyses for ALL 24 existing lessons
  const EXISTING_LESSON_ANALYSES = {
    'lesson-1-1': {
      variations: [
        {
          id: 'demo',
          kind: 'good',
          label: 'Minh họa: Khí 4-3-2',
          summary: 'Quan sát sự khác biệt số khí giữa quân ở giữa bàn (4), biên (3) và góc (2).',
          initialPosition: { black: [[4, 4], [4, 0], [0, 0]], white: [] },
          steps: [
            {
              caption: 'Quan sát 3 quân Đen: ở giữa bàn (E5) có 4 khí, ở biên (E9) có 3 khí, ở góc (A9) chỉ có 2 khí.',
              why: 'Khí chỉ tính theo 4 hướng ngang/dọc. Ở góc có 2 cạnh bàn cờ chặn sẵn nên chỉ còn tối đa 2 khí.',
              markers: [
                { x: 4, y: 3, type: 'dot', color: '#0284c7' },
                { x: 4, y: 5, type: 'dot', color: '#0284c7' },
                { x: 3, y: 4, type: 'dot', color: '#0284c7' },
                { x: 5, y: 4, type: 'dot', color: '#0284c7' },
                { x: 3, y: 0, type: 'dot', color: '#0284c7' },
                { x: 5, y: 0, type: 'dot', color: '#0284c7' },
                { x: 4, y: 1, type: 'dot', color: '#0284c7' },
                { x: 1, y: 0, type: 'dot', color: '#0284c7' },
                { x: 0, y: 1, type: 'dot', color: '#0284c7' }
              ]
            },
            {
              moves: [{ x: 1, y: 0, color: WHITE }],
              caption: 'Trắng đánh B9: quân Đen ở góc (A9) mất 1 khí và chỉ còn duy nhất 1 khí tại A8!',
              why: 'Bịt các giao điểm ngang/dọc liền kề là cách duy nhất làm giảm khí của quân địch.'
            },
            {
              moves: [{ x: 0, y: 1, color: WHITE }],
              caption: 'Trắng bịt nốt khí cuối cùng tại A8 → Quân Đen (A9) còn 0 khí và bị bắt!',
              why: 'Bất kỳ quân hoặc nhóm quân nào chạm mốc 0 khí đều bị nhấc khỏi bàn cờ ngay lập tức.'
            }
          ]
        },
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: A8 bắt góc',
          summary: 'Đánh trực tiếp vào khí ngang/dọc cuối cùng A8 để ăn quân Trắng A9.',
          initialPosition: { black: [[1, 0]], white: [[0, 0]] },
          steps: [
            {
              caption: 'Trong thế cờ bài tập, quân Trắng A9 đã bị B9 chặn 1 khí, chỉ còn đúng 1 khí tại A8.',
              why: 'Mục tiêu là đánh vào giao điểm chạm thẳng vào cạnh quân Trắng.'
            },
            {
              moves: [{ x: 0, y: 1, color: BLACK }],
              caption: 'Đen đánh A8 — Trắng hết sạch 0 khí và bị ăn ngay lập tức!',
              why: 'A8 là khí cuối cùng theo chiều dọc của A9 nên nước đi hợp lệ và bắt gọn quân góc.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: B8 đi chéo',
          summary: 'Nước chéo B8 không lấy đi khí nào của A9, để Trắng chạy ra A8 thoát hiểm.',
          initialPosition: { black: [[1, 0]], white: [[0, 0]] },
          steps: [
            {
              caption: 'Xét nước đánh chéo vào B8 — lỗi rất hay gặp khi mới tập đếm khí.',
              why: 'Nhiều bạn tưởng bao chéo ở B8 là khóa được góc A9.'
            },
            {
              moves: [{ x: 1, y: 1, color: BLACK }],
              caption: 'Đen đánh B8: đường chéo không lấy khí của A9, nên A9 vẫn còn nguyên khí A8.',
              why: 'Trong cờ vây, đường chéo KHÔNG phải khí và KHÔNG nối trực tiếp hai quân.'
            },
            {
              moves: [{ x: 0, y: 1, color: WHITE }],
              caption: 'Trắng chạy xuống A8! Lúc này cụm 2 quân Trắng tăng lên 2 khí (A7 và B8 đã bị Đen chiếm? Không, còn A7) và thoát khỏi thế chết ngay lập tức.',
              why: 'Luôn kiểm tra 4 hướng thẳng đứng/nằm ngang khi muốn bắt quân.'
            }
          ]
        }
      ]
    },

    'lesson-1-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E4 ăn Atari',
          summary: 'Đánh đúng khí cuối cùng E4 để bắt trọn quân Trắng E5 đang bị Atari.',
          initialPosition: { black: [[3, 4], [5, 4], [4, 3]], white: [[4, 4]] },
          steps: [
            {
              caption: 'Quân Trắng E5 đã bị 3 quân Đen vây kín 3 mặt, chỉ còn duy nhất 1 khí tại E4.',
              why: 'Trạng thái còn 1 khí gọi là Atari — nếu đến lượt Đen, Đen có thể ăn ngay.'
            },
            {
              moves: [{ x: 4, y: 5, color: BLACK }],
              caption: 'Đen đặt quân vào E4 → Trắng còn 0 khí và trở thành Tù binh!',
              why: 'Mỗi tù binh ăn được mang lại +1 điểm trực tiếp ở cuối ván theo luật Nhật Bản.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D4 bỏ lỡ',
          summary: 'Đánh lệch sang D4 cho phép Trắng nối dài xuống E4 và tăng từ 1 khí lên 3 khí.',
          initialPosition: { black: [[3, 4], [5, 4], [4, 3]], white: [[4, 4]] },
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh chéo xuống D4 thay vì ăn thẳng vào E4.',
              why: 'Thả lỏng cơ hội ăn quân đang bị Atari là sai lầm rất đáng tiếc.'
            },
            {
              moves: [{ x: 3, y: 5, color: BLACK }],
              caption: 'Đen đánh D4 — vẫn chừa nguyên khí E4 cho Trắng.',
              why: 'Quân Trắng E5 vẫn còn sống và sẵn sàng phản công.'
            },
            {
              moves: [{ x: 4, y: 5, color: WHITE }],
              caption: 'Trắng chạy ngay xuống E4! Dù có D4 bên cạnh, Trắng vẫn có thêm 2 khí (F4, E3) để vươn ra ngoài.',
              why: 'Khi đối thủ bị Atari mà bạn không ăn ngay, họ chỉ cần 1 nước để tăng gấp đôi/gấp ba số khí.'
            }
          ]
        }
      ]
    },

    'lesson-1-3': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E4 nối dài Nobi',
          summary: 'Nối thẳng xuống khí cuối E4 để tăng từ 1 khí lên thành 3 khí, thoát hiểm an toàn.',
          steps: [
            {
              caption: 'Quân Đen E5 đang bị 3 quân Trắng vây chặt, chỉ còn đúng 1 khí ở E4.',
              why: 'Nếu không đi vào E4 ngay, nước sau Trắng sẽ ăn mất E5.'
            },
            {
              moves: [{ x: 4, y: 5, color: BLACK }],
              caption: 'Đen nối dài xuống E4 (Nobi)! Cụm 2 quân Đen giờ có tới 3 khí mới (D4, F4, E3).',
              why: 'Hai quân đứng liền kề gộp chung khí, từ thế ngàn cân treo sợi tóc chuyển sang an toàn vững chắc.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D4 chạy chéo',
          summary: 'Đánh chéo D4 không nối được với E5, khiến Trắng ăn ngay quân E5 tại E4.',
          steps: [
            {
              caption: 'Xét trường hợp Đen thử đánh chéo xuống D4 để chạy.',
              why: 'Người mới hay nhầm tưởng quân đặt chéo D4 sẽ cứu được E5.'
            },
            {
              moves: [{ x: 3, y: 5, color: BLACK }],
              caption: 'Đen đánh D4 — nhưng E5 và D4 hoàn toàn tách rời nhau!',
              why: 'E5 vẫn chỉ còn đúng 1 khí ở E4.'
            },
            {
              moves: [{ x: 4, y: 5, color: WHITE }],
              caption: 'Trắng đánh ngay vào E4 và ăn mất quân Đen E5!',
              why: 'Chạy Atari chỉ có tác dụng khi bạn nối liền trực tiếp (ngang/dọc) vào đúng khí cuối cùng.'
            }
          ]
        }
      ]
    },

    'lesson-1-4': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: F5 ăn Cướp (Ko)',
          summary: 'Đánh F5 ăn quân Trắng E5 (ngoại lệ Luật Tự Sát) và khóa Cướp ngăn Trắng ăn trả ngay.',
          initialPosition: {
            black: [[3, 4], [4, 3], [4, 5]],
            white: [[4, 4], [5, 3], [5, 5], [6, 4]]
          },
          steps: [
            {
              caption: 'Trông như F5 bị 3 quân Trắng vây kín, nhưng quân Trắng E5 cũng chỉ còn 1 khí duy nhất tại F5!',
              why: 'Theo Luật Tự Sát, một nước có 0 khí vẫn HỢP LỆ nếu nó ăn được ít nhất 1 quân đối phương.'
            },
            {
              moves: [{ x: 5, y: 4, color: BLACK }],
              caption: 'Đen đánh F5 — ăn quân Trắng E5 và kích hoạt Luật Cướp (Ko)!',
              why: 'Vì Đen dùng 1 quân ăn 1 quân và bản thân F5 chỉ còn 1 khí (E5), Trắng BỊ CẤM ăn trả ngay vào E5 ở lượt kế tiếp!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: B8 bỏ lỡ Cướp',
          summary: 'Bỏ qua nước ăn Cướp F5 giúp Trắng nối E5 thành 3 khí và chấm dứt tranh chấp.',
          initialPosition: {
            black: [[3, 4], [4, 3], [4, 5]],
            white: [[4, 4], [5, 3], [5, 5], [6, 4]]
          },
          steps: [
            {
              caption: 'Xét trường hợp Đen tưởng F5 là tự sát nên không dám đánh và đi ra B8.',
              why: 'Sợ nhầm Luật Tự Sát là lý do phổ biến khiến người mới bỏ lỡ thế Cướp.'
            },
            {
              moves: [{ x: 1, y: 1, color: BLACK }],
              caption: 'Đen đi B8 ở xa, bỏ mặc điểm Cướp trung tâm.',
              why: 'Quân Trắng E5 vẫn chỉ còn 1 khí và chờ được nối.'
            },
            {
              moves: [{ x: 5, y: 4, color: WHITE }],
              caption: 'Trắng nối ngay tại F5! Cụm Trắng hợp nhất vững chắc với 4 khí mới.',
              why: 'Không những mất cơ hội ăn quân, Đen còn để Trắng biến điểm yếu thành bức tường cứng.'
            }
          ]
        }
      ]
    },

    'lesson-2-1': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E8 nối 3 quân',
          summary: 'Nối thẳng E8 để cứu quân E7 khỏi Atari và hợp nhất cả 3 quân Đen thành 1 khối vững chắc.',
          initialPosition: {
            black: [[3, 1], [5, 1], [4, 2]],
            white: [[2, 1], [3, 2], [5, 2], [6, 1], [4, 3]]
          },
          steps: [
            {
              caption: 'Quân Đen E7 đang bị Trắng bao vây 3 mặt, chỉ còn 1 khí duy nhất tại E8 — đây cũng là điểm nối giữa D8 và F8.',
              why: 'Một nước đánh tại E8 vừa cứu E7 vừa nối luôn hai cánh D8 và F8.'
            },
            {
              moves: [{ x: 4, y: 1, color: BLACK }],
              caption: 'Đen nối tại E8! Bốn quân D8-E8-F8-E7 hợp nhất thành một khối lớn có tới 3 khí ở biên trên.',
              why: '“Một nhóm mạnh luôn thắng nhiều nhóm yếu” — hai quân Trắng D7 và F7 bây giờ lại bị tách rời.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D9 bỏ điểm cắt',
          summary: 'Không nối E8 khiến Trắng cắt thẳng vào E8, ăn quân E7 và chia đôi quân Đen.',
          initialPosition: {
            black: [[3, 1], [5, 1], [4, 2]],
            white: [[2, 1], [3, 2], [5, 2], [6, 1], [4, 3]]
          },
          steps: [
            {
              caption: 'Xét trường hợp Đen đi ở ngoài (D9) mà quên nối điểm cắt E8.',
              why: 'Khi có quân bị Atari đồng thời là điểm cắt, sự chần chừ sẽ trả giá ngay lập tức.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh D9, để hở hoàn toàn giao điểm E8.',
              why: 'E7 vẫn còn đúng 1 khí tại E8.'
            },
            {
              moves: [{ x: 4, y: 1, color: WHITE }],
              caption: 'Trắng cắt vào E8! Trắng ăn ngay quân E7 và chia rẽ D8-D9 với F8.',
              why: 'Chỉ cần một nước cắt E8, Trắng vừa ăn quân vừa giữ vững liên kết trung tâm.'
            }
          ]
        }
      ]
    },

    'lesson-2-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: E6 Song Chiếu',
          summary: 'Đặt quân vào điểm chung E6 khiến cả D6 và F6 cùng bị Atari — chắc chắn ăn được 1 quân!',
          steps: [
            {
              caption: 'Hai quân Trắng D6 và F6 đều đang còn 2 khí, và cả hai đều dùng chung khí E6.',
              why: 'Đánh vào khí chung của hai nhóm còn 2 khí sẽ kích hoạt đòn Song Chiếu.'
            },
            {
              moves: [{ x: 4, y: 3, color: BLACK }],
              caption: 'Đen đánh E6 → Song Chiếu! Cả D6 lẫn F6 cùng bị ép xuống còn 1 khí.',
              why: 'Bản thân quân E6 nối liền với D5-E5-F5 thành tường cực mạnh, nên Trắng không thể phản công.'
            },
            {
              moves: [{ x: 3, y: 2, color: WHITE }],
              caption: 'Trắng buộc phải chọn cứu 1 bên, ví dụ chạy D6 lên D7.',
              why: 'Đối thủ chỉ được đi 1 nước mỗi lượt, không thể cứu cả hai!'
            },
            {
              moves: [{ x: 5, y: 2, color: BLACK }],
              caption: 'Đen ăn gọn quân Trắng F6 tại F7!',
              why: 'Song Chiếu là đòn đảm bảo thắng lợi 100% khi không có nước phản chiếu.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D7 chiếu lẻ 1 bên',
          summary: 'Chiếu lẻ D7 giúp Trắng nối thẳng ra E6, cứu cùng lúc cả D6 và F6.',
          steps: [
            {
              caption: 'Xét trường hợp Đen không đánh E6 mà lại đánh D7 để chiếu riêng quân D6.',
              why: 'Đánh lệch ra ngoài để hở điểm nối chung E6.'
            },
            {
              moves: [{ x: 3, y: 2, color: BLACK }],
              caption: 'Đen đánh D7 (chỉ chiếu mình quân D6).',
              why: 'Quân F6 hoàn toàn tự do và điểm nối E6 vẫn trống.'
            },
            {
              moves: [{ x: 4, y: 3, color: WHITE }],
              caption: 'Trắng nối ngay tại E6! Cả D6-E6-F6 hợp nhất thành 3 quân với tới 4 khí, hoàn toàn thoát hiểm.',
              why: 'Khi có cơ hội Song Chiếu ở giữa, tuyệt đối không đánh từ hai bên hông.'
            }
          ]
        }
      ]
    },

    'lesson-2-3': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: H3 mở Cầu Thang',
          summary: 'Chặn hướng rộng H3 để ép Trắng chạy vào đường zig-zag đụng góc dưới phải.',
          steps: [
            {
              caption: 'Quân Trắng G3 chỉ còn 2 khí (H3 và G2). Đen muốn ép Trắng đâm vào góc phải dưới.',
              why: 'Không gian bên phải (H3) mở ra biên hẹp, còn nếu đẩy xuống dưới không khéo Trắng có thể chạy về phía trống?'
            },
            {
              moves: [{ x: 7, y: 6, color: BLACK }],
              caption: 'Đen chặn H3 (Atari)! Ép Trắng chạy xuống G2.',
              why: 'G2 sát biên dưới nhưng lại hướng về phía không có đồng đội Trắng.'
            },
            {
              moves: [{ x: 6, y: 7, color: WHITE }],
              caption: 'Trắng chạy G2 (vẫn chỉ còn 2 khí G1 và H2).',
              why: 'Cụm 2 quân Trắng tiếp tục bị kẹp chặt trong trạng thái 2 khí.'
            },
            {
              moves: [{ x: 6, y: 8, color: BLACK }],
              caption: 'Đen chặn tiếp G1, ép Trắng rẽ sang H2.',
              why: 'Mỗi nước của Đen luôn bẻ vuông góc để không cho Trắng có cơ hội tăng khí lên 3.'
            },
            {
              moves: [{ x: 7, y: 7, color: WHITE }, { x: 8, y: 7, color: BLACK }, { x: 7, y: 8, color: WHITE }, { x: 8, y: 8, color: BLACK }],
              caption: 'Trắng H2 → Đen J2 → Trắng H1 → Đen J1 ăn trọn 4 quân Trắng!',
              why: 'Đọc hết đường chéo trước khi đánh Cầu Thang đảm bảo không có quân Trắng nào phá đám.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: G2 sai hướng',
          summary: 'Nếu đánh G2 trước, Trắng chạy sang H3 và tăng khí dễ dàng ở cánh phải? Hoặc đổi hướng thoát!',
          steps: [
            {
              caption: 'Xét trường hợp Đen chọn chặn G2 trước thay vì H3.',
              why: 'So sánh hai hướng bắt đầu Cầu Thang: H3 ép sát góc, còn G2 thì sao?'
            },
            {
              moves: [{ x: 6, y: 7, color: BLACK }],
              caption: 'Đen chặn G2 — đẩy Trắng chạy ngang sang H3.',
              why: 'Chú ý hình dạng quân Đen: G4 chỉ có 1 quân đứng lẻ ở trên.'
            },
            {
              moves: [{ x: 7, y: 6, color: WHITE }],
              caption: 'Trắng chạy sang H3 và bây giờ Trắng đe dọa cắt đôi F3 với G4 (nếu Đen không cẩn thận)!',
              why: 'Dù ở biên này H3 vẫn nhỏ, nhưng đánh H3 trước giúp Đen giữ tường dưới F2-F3 liền mạch hơn nhiều và ép Trắng vào góc chết.'
            }
          ]
        }
      ]
    },

    'lesson-2-4': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: F4 giăng Lưới',
          summary: 'Đánh chéo F4 giăng Lưới khóa chết cả hai hướng thoát của E5 bất chấp quân H2 đón đầu.',
          steps: [
            {
              caption: 'Trắng E5 chỉ còn 2 khí (F5 và E4), nhưng góc dưới phải có sẵn Trắng H2 đón sẵn (Phá Cầu Thang).',
              why: 'Nếu dùng Cầu Thang ở F5 hoặc E4, Trắng sẽ chạy thẳng về gặp H2.'
            },
            {
              moves: [{ x: 5, y: 5, color: BLACK }],
              caption: 'Đen giăng Lưới tại F4 (cách chéo E5)!',
              why: 'F4 giăng lồng nhốt E5 mà không hề chạm vào E5, khiến Trắng không thể tạo ra thế chạy Atari liên hoàn.'
            },
            {
              moves: [{ x: 5, y: 4, color: WHITE }],
              caption: 'Trắng cố chạy sang F5 để thoát...',
              why: 'Dù Trắng sang F5 hay xuống E4, phía bên kia đều đã có lồng F4 chặn sẵn.'
            },
            {
              moves: [{ x: 6, y: 4, color: BLACK }, { x: 4, y: 5, color: WHITE }, { x: 4, y: 6, color: BLACK }],
              caption: 'Đen chặn G5 → Trắng giãy E4 → Đen khóa E3 ăn trọn cả 3 quân Trắng!',
              why: 'Thế Lưới (Geta) vô hiệu hóa hoàn toàn quân phá Cầu Thang H2.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: F5 Cầu Thang gãy',
          summary: 'Cố đánh Cầu Thang ở F5 đẩy Trắng chạy qua E4 và nối thẳng tới quân đón đầu H2.',
          steps: [
            {
              caption: 'Xét trường hợp Đen quên kiểm tra quân H2 và lao vào đánh F5.',
              why: 'Đây là tai nạn kinh điển: “Đánh Cầu Thang mà quên đọc đường chéo”.'
            },
            {
              moves: [{ x: 5, y: 4, color: BLACK }],
              caption: 'Đen đánh F5 (Atari E5), tưởng như sẽ ép được Trắng.',
              why: 'Trắng chỉ còn đường chạy xuống E4.'
            },
            {
              moves: [{ x: 4, y: 5, color: WHITE }],
              caption: 'Trắng chạy xuống E4! Lúc này trên đường chéo E5-E4-F4-G3 có quân H2 đón sẵn — Cầu Thang gãy và Đen bị cắt nát các điểm yếu xung quanh!',
              why: 'Luôn kiểm tra đường chéo trước khi đánh Cầu Thang; thấy quân địch đón đầu thì chuyển ngay sang Lưới F4!'
            }
          ]
        }
      ]
    },

    'lesson-2-5': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D9 Hồi Mã Thương',
          summary: 'Thí 1 quân ở D9 ép Trắng ăn vào E9 và tự nhốt mình còn 1 khí, rồi ăn lại 7 quân.',
          steps: [
            {
              caption: 'Cụm 6 quân Trắng trông rất kín, chỉ có 2 khoảng trống bên trong là D9 và E9.',
              why: 'Chú ý cả cụm 6 quân Trắng chỉ còn tổng cộng 2 khí này.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen ném 1 quân hy sinh vào D9! Nước này đặt cả đám Trắng vào thế Atari.',
              why: 'D9 chỉ có 1 khí (E9), nhưng Trắng muốn sống bắt buộc phải ăn nó tại E9.'
            },
            {
              moves: [{ x: 4, y: 0, color: WHITE }],
              caption: 'Trắng ăn quân Đen D9 bằng cách đặt vào E9 — nhưng lúc này cả 7 quân Trắng chỉ còn 1 khí tại chính ô D9!',
              why: 'Trắng đã tự bước vào cái bẫy tự thu hẹp khí cuối cùng của mình.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Hồi Mã Thương! Đen đánh trả ngay vào D9 (không bị luật Ko cấm) và ăn sạch 7 quân Trắng!',
              why: 'Luật Ko chỉ cấm ăn lại 1 quân khi đối thủ cũng chỉ có 1 quân. Ở đây cụm Trắng có tới 7 quân nên Đen được phép ăn ngay lập tức!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: G9 đánh ngoài',
          summary: 'Đánh ở ngoài vô nghĩa — Trắng tự nối D9 hoặc E9 để tạo thành 2 mắt sống.',
          steps: [
            {
              caption: 'Xét trường hợp Đen không dám thí quân vào trong mà lại đánh ra ngoài ở H9.',
              why: 'Nhiều bạn mới ngại đánh vào ô chỉ có 1 khí vì sợ mất quân.'
            },
            {
              moves: [{ x: 7, y: 0, color: BLACK }],
              caption: 'Đen đánh H9 ở bên ngoài vòng vây vốn đã kín.',
              why: 'Nước này không lấy đi khí nào bên trong của Trắng.'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng nối vào D9! Không những tăng thêm khí mà nếu mở rộng chút nữa Trắng có thể làm mắt sống hoặc thoát hiểm.',
              why: 'Trong thế Hồi Mã Thương, phải dám hy sinh 1 quân vào trong để lột sạch 7 quân của địch!'
            }
          ]
        }
      ]
    },

    'lesson-2-6': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: C9 cướp khí ngoài',
          summary: 'Cướp khí ngoài từ phía C9 để giảm Trắng xuống 1 khí (D8) và thắng Semeai trước 1 nhịp.',
          steps: [
            {
              caption: 'Cụm Đen góc (A8-B8-B7) còn 2 khí (A9, B9). Cụm 6 quân Trắng bao vây cũng còn đúng 2 khí (C9, D8).',
              why: 'Hai bên cùng có 2 khí nhưng Đen được quyền đi trước — chọn hướng cướp khí quyết định thắng bại!'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9 từ phía trước! Nước này vừa bịt khí C9 của Trắng, vừa ngăn Trắng mở rộng thêm khí lên biên trên.',
              why: 'Trắng lập tức bị đặt vào thế Atari (chỉ còn 1 khí D8).'
            },
            {
              moves: [{ x: 1, y: 0, color: WHITE }, { x: 3, y: 1, color: BLACK }],
              caption: 'Trắng cố chiếu Đen tại B9, nhưng Đen nhanh hơn 1 nhịp đánh D8 ăn sạch 6 quân Trắng!',
              why: 'Cướp khí ngoài C9 khiến Trắng không thể phản kháng.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: D8 sai hướng / B9 chạy',
          summary: 'Đánh D8 trước giúp Trắng đánh C9 tự tăng thêm khí (B9 và D9) và thắng ngược lại!',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh vào D8 trước thay vì C9.',
              why: 'Nhiều bạn nghĩ 2 khí thì đánh khí nào trước cũng giống nhau — hoàn toàn sai trong Semeai!'
            },
            {
              moves: [{ x: 3, y: 1, color: BLACK }],
              caption: 'Đen đánh D8, vẫn để hở điểm C9 phía biên trên.',
              why: 'Nước D8 đặt Trắng vào Atari tại C9, nhưng hãy xem Trắng đánh C9 sẽ xảy ra chuyện gì!'
            },
            {
              moves: [{ x: 2, y: 0, color: WHITE }],
              caption: 'Trắng đánh C9! Nhìn kỹ: quân Trắng C9 nối với toàn cụm Trắng đồng thời tạo thêm khí ở B9 và bịt luôn đường chạy của Đen — Trắng lật ngược thế cờ và thắng Semeai!',
              why: 'Khi Đua Khí, luôn kiểm tra xem nước đánh nào thu hẹp không gian biên/mắt của đối phương (C9 vừa bịt khí Trắng vừa thu hẹp chỗ thở).'
            }
          ]
        }
      ]
    },

    'lesson-3-1': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D9 chia 2 mắt',
          summary: 'Đánh vào điểm giữa D9 chia 3 ô thẳng hàng thành 2 mắt thật tách biệt (C9 và E9).',
          steps: [
            {
              caption: 'Đám Đen ở biên trên bị vây kín, bên trong chỉ có khoảng trống 3 ô thẳng hàng (C9, D9, E9).',
              why: 'Hình Tam Trực 3 ô có đúng 1 yếu điểm sống-chết nằm ở chính giữa.'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen đánh vào điểm giữa D9! Khoảng trống tách làm 2 mắt thật hoàn chỉnh tại C9 và E9 — Đen bất tử!',
              why: 'Trắng không thể đi vào C9 hay E9 vì đi vào mắt nào cũng là tự sát (mắt kia vẫn còn khí cho Đen).'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C9 lệch tâm',
          summary: 'Đánh lệch sang C9 để Trắng cướp ngay điểm giữa D9, biến Đen thành 1 mắt chết.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh lệch sang một đầu mút là C9.',
              why: 'Đánh vào đầu mút không thể chia khoảng trống làm 2 phần tách biệt.'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9, chỉ thu hẹp không gian còn lại thành 2 ô liền kề (D9 và E9).',
              why: 'Hai ô liền kề nhau vẫn chỉ tính là 1 mắt duy nhất!'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng chiếm ngay điểm giữa D9! Bây giờ Đen có ăn D9 ở E9 thì cũng chỉ còn đúng 1 mắt và chết toàn bộ.',
              why: 'Luôn đánh vào điểm giữa của Tam Trực để làm 2 mắt sống.'
            }
          ]
        }
      ]
    },

    'lesson-3-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: B8 phá Mắt Giả',
          summary: 'Đánh vào ô chéo B8 để Atari quân Trắng A8, biến mắt A9 thành Mắt Giả.',
          steps: [
            {
              caption: 'Trắng góc trên trái trông như có 2 mắt ở A9 và C9. Nhưng hãy kiểm tra 2 ô chéo của mắt A9 — ô B8 đang trống!',
              why: 'Nếu Đen chiếm được B8, bức tường quanh A9 bị đứt gãy vì B9 và A8 không nối được với nhau.'
            },
            {
              moves: [{ x: 1, y: 1, color: BLACK }],
              caption: 'Đen đánh B8! Nước này đặt quân Trắng A8 vào thế Atari và phơi bày A9 chỉ là Mắt Giả.',
              why: 'B8 được A7 và B7 bảo vệ nên Trắng không thể ăn quân Đen B8.'
            },
            {
              moves: [{ x: 0, y: 0, color: WHITE }],
              caption: 'Trắng buộc phải nối ở A9 để cứu A8 — tự tay lấp mất mắt của mình và chỉ còn 1 mắt (C9) → chết sạch!',
              why: 'Nhận diện Mắt Giả qua các giao điểm chéo giúp bạn giết nhiều đám quân tưởng chừng đã sống.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: E9 đánh ngoài',
          summary: 'Đánh ngoài E9 để Trắng kịp nối vào B8 biến A9 thành Mắt Thật và sống.',
          steps: [
            {
              caption: 'Xét trường hợp Đen nghĩ Trắng đã sống nên đi ở ngoài tại F9.',
              why: 'Không kiểm tra mắt giả ở góc là sai lầm bỏ lỡ rất lớn.'
            },
            {
              moves: [{ x: 5, y: 0, color: BLACK }],
              caption: 'Đen đánh F9 ở ngoài, để hở giao điểm chéo B8.',
              why: 'Trắng lập tức nhìn thấy nguy cơ ở B8.'
            },
            {
              moves: [{ x: 1, y: 1, color: WHITE }],
              caption: 'Trắng nối ngay tại B8! Lúc này B9-A8-C8 nối liền một khối, A9 trở thành Mắt Thật — Trắng sống với 2 mắt!',
              why: 'Ô chéo B8 là ranh giới sống-chết: Đen đánh B8 thì Trắng chết, Trắng nối B8 thì Trắng sống.'
            }
          ]
        }
      ]
    },

    'lesson-3-3': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D9 điểm sống chết',
          summary: 'Chiếm ngay điểm giữa D9 của Tam Trực để Trắng không bao giờ tách được thành 2 mắt.',
          steps: [
            {
              caption: 'Trắng có 3 ô thẳng hàng (C9, D9, E9). Nếu đến lượt Trắng, Trắng đánh D9 là sống.',
              why: 'Theo châm ngôn “Điểm sống của địch cũng là điểm giết của ta”, Đen phải đánh ngay vào D9!'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen chiếm ngay D9! Không gian còn lại bên trong không thể chia làm 2 mắt nữa — Trắng chết hoàn toàn!',
              why: 'Dù Trắng có vây bắt quân D9 bằng cách đánh C9 rồi E9, phần trống còn lại chỉ tạo đúng 1 mắt.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C9 sai điểm',
          summary: 'Đánh C9 để Trắng chiếm lại yếu điểm D9 và sống ngay lập tức với 2 mắt.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh vào góc ô C9 trước để thu hẹp đất Trắng.',
              why: 'Đây là sai lầm rất phổ biến: đánh từ rìa vào thay vì đánh thẳng vào yếu điểm giữa.'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9 — bỏ trống D9 và E9 ở bên cạnh.',
              why: 'Đen chỉ còn 1 khí? Thực ra C9 chỉ làm mất 1 ô nhưng lại mở toang D9.'
            },
            {
              moves: [{ x: 3, y: 0, color: WHITE }],
              caption: 'Trắng đánh ngay vào D9 (vừa bắt C9 vừa tạo mắt)! Trắng sống với 2 mắt hoàn chỉnh.',
              why: 'Luôn đánh vào chính giữa Tam Trực (D9) khi tấn công cũng như khi phòng thủ.'
            }
          ]
        }
      ]
    },

    'lesson-3-4': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: C9 Nakade Nắm Đấm',
          summary: 'Đánh vào điểm tâm C9 của hình Nắm Đấm (Bulky Five) khiến Trắng chỉ còn 1 mắt sau khi ăn.',
          steps: [
            {
              caption: 'Trắng có không gian 5 ô hình Nắm Đấm: B9, C9, D9, B8, C8.',
              why: 'Trong hình 5 ô Nắm Đấm, C9 là điểm duy nhất chạm tới 3 ô trống (B9, D9, C8).'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh Nakade vào điểm tâm C9!',
              why: 'Nước C9 chặn D9 và chia cắt tầm mắt. Nếu Trắng muốn ăn quân C9, Trắng phải tự thu hẹp không gian về còn tối đa 3 ô thẳng/cong → chết!'
            },
            {
              moves: [{ x: 1, y: 1, color: WHITE }, { x: 1, y: 0, color: BLACK }, { x: 2, y: 1, color: WHITE }],
              caption: 'Dù Trắng có vây chặt (B8, C8) để ăn các quân Đen bên trong, không gian còn lại vẫn chỉ tạo được 1 mắt duy nhất!',
              why: 'Đó là bản chất tuyệt vời của Nakade: dùng 1–2 quân chết để tiêu diệt cả đám quân lớn.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C8 đánh sai tâm',
          summary: 'Đánh C8 để Trắng chiếm lại điểm tâm C9 và tách thành 2 mắt sống rõ rệt.',
          steps: [
            {
              caption: 'Xét trường hợp Đen chọn đánh ở C8 (hàng 2) thay vì C9 (hàng 1).',
              why: 'Nhiều bạn nhầm C8 là điểm tâm vì nó nằm ở giữa đám quân.'
            },
            {
              moves: [{ x: 2, y: 1, color: BLACK }],
              caption: 'Đen đánh C8 — chừa lại hàng trên B9, C9, D9 hoàn toàn thông thoáng!',
              why: 'Ba ô hàng trên + B8 tạo thành vùng sống rất rộng cho Trắng.'
            },
            {
              moves: [{ x: 2, y: 0, color: WHITE }],
              caption: 'Trắng đánh ngay vào C9! Trắng lập tức có 1 mắt ở D9 và 1 mắt thứ hai ở {B9, B8} → sống 100%!',
              why: 'C9 mới là tâm của hình Nắm Đấm (Bulky Five), không phải C8.'
            }
          ]
        }
      ]
    },

    'lesson-3-5': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: B8 lập Song Sống',
          summary: 'Nối chắc tại B8 để có 1 mắt thật A9 + 1 khí chung C9, thiết lập thế Seki cả hai cùng sống.',
          steps: [
            {
              caption: 'Đen A8 và B9 đang tách rời; Trắng đã có 1 mắt ở E9 và rình cắt vào B8.',
              why: 'Đen không thể làm 2 mắt vì góc quá hẹp, nên mục tiêu cao nhất là đạt thế Song Sống (Seki).'
            },
            {
              moves: [{ x: 1, y: 1, color: BLACK }],
              caption: 'Đen nối chắc tại B8! Giờ Đen có 1 mắt thật (A9) + 1 khí chung (C9), và Trắng cũng có 1 mắt (E9) + 1 khí chung (C9).',
              why: 'Nếu Đen đánh C9 → Trắng ăn sạch ở A9? Không, Đen sẽ tự còn 1 khí và Trắng ăn Đen! Ngược lại nếu Trắng đánh C9 → Trắng tự còn 1 khí ở E9 và Đen ăn sạch Trắng! Vậy không ai dám đi C9 → Song Sống!'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C9 bỏ điểm nối',
          summary: 'Đánh C9 để Trắng chém vào điểm cắt B8 ăn quân B9 và giết cả góc Đen.',
          steps: [
            {
              caption: 'Xét trường hợp Đen ham đánh C9 trước mà quên nối điểm cắt B8.',
              why: 'Trước khi tranh khí chung C9, phải đảm bảo tường của mình đã nối kín.'
            },
            {
              moves: [{ x: 2, y: 0, color: BLACK }],
              caption: 'Đen đánh C9 — bỏ hở điểm cắt B8 ngay sau lưng B9.',
              why: 'Quân B9 và C9 chỉ có 1 khí là B8!'
            },
            {
              moves: [{ x: 1, y: 1, color: WHITE }],
              caption: 'Trắng đánh ngay vào B8 ăn gọn 2 quân Đen B9-C9! Trắng có thêm đất và giết sạch Đen A8.',
              why: 'Nối B8 trước là điều kiện bắt buộc để tạo ra thế Song Sống (Seki).'
            }
          ]
        }
      ]
    },

    'lesson-4-1': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D4 Nối Tre',
          summary: 'Hoàn chỉnh hình Nối Tre (Bamboo Joint) tại D4 — liên kết 100% và không tạo Tam Giác Rỗng.',
          steps: [
            {
              caption: 'Đen cần nối cặp C6-D6 với quân C4 bên dưới đang bị Trắng B5 và E5 ép hai bên.',
              why: 'Nối thế nào vừa chắc chắn không thể bị cắt, vừa giữ nhiều khí và hình cờ đẹp?'
            },
            {
              moves: [{ x: 3, y: 5, color: BLACK }],
              caption: 'Đen đánh D4 tạo hình Nối Tre (Bamboo Joint)! Cả 4 quân liên kết mềm mại nhưng cực kỳ vững.',
              why: 'Không tạo Tam Giác Rỗng, tăng khí tối đa và mở hướng phát triển xuống dưới.'
            },
            {
              moves: [{ x: 2, y: 4, color: WHITE }, { x: 3, y: 4, color: BLACK }],
              caption: 'Nếu Trắng cắt vào C5, Đen chỉ việc nối tại D5 — liên kết hoàn toàn không thể bị cắt đứt!',
              why: 'Đây là lý do Nối Tre luôn được ưu tiên hàng đầu khi cần nối qua một khoảng trống 1 ô.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: C5 Tam Giác Rỗng',
          summary: 'Đánh C5 tạo hình Tam Giác Rỗng nặng nề và bị Trắng cắt D5 cô lập.',
          steps: [
            {
              caption: 'Xét trường hợp Đen cố nối thẳng vào C5 giữa C6 và C4.',
              why: 'Đánh thẳng vào C5 tạo thành cụm 3 quân chữ L (C6-D6-C5) quanh ô trống D5 — chính là Tam Giác Rỗng!'
            },
            {
              moves: [{ x: 2, y: 4, color: BLACK }],
              caption: 'Đen đánh C5 (Tam Giác Rỗng) — số khí bị tụt giảm và hình cờ trở nên nặng nề.',
              why: 'Trong khi đó điểm D5 vẫn còn hở trước mặt quân Trắng E5.'
            },
            {
              moves: [{ x: 3, y: 4, color: WHITE }],
              caption: 'Trắng đánh ngay vào D5! Trắng đe dọa cắt và ép sát toàn bộ hình Tam Giác Rỗng của Đen.',
              why: 'So với Nối Tre D4 vừa đẹp vừa không thể cắt, C5 là hình cờ xấu cần tránh.'
            }
          ]
        }
      ]
    },

    'lesson-4-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: F5 Bẻ đầu 2 quân',
          summary: 'Áp dụng cách ngôn “Bẻ đầu hai quân” tại F5 — ép chặt khí Trắng và chiếm không gian phải.',
          steps: [
            {
              caption: 'Hai quân Đen D6-E6 và hai quân Trắng D5-E5 đang áp sát nhau. Đầu bên trái đã có Đen C5 khóa lại.',
              why: 'Tranh chấp khí quyết liệt nhất nằm ở đầu bên phải (cột F).'
            },
            {
              moves: [{ x: 5, y: 4, color: BLACK }],
              caption: 'Đen bẻ xuống đầu hai quân Trắng tại F5 (Hane)!',
              why: 'Nước bẻ F5 làm cụm 2 quân Trắng giảm khí mạnh, đồng thời vươn tường Đen sang bên phải áp đảo hoàn toàn.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: F6 nối dài quá hiền',
          summary: 'Nối dài F6 để Trắng bẻ ngược lại F5 — Đen mất ưu thế khí và bị ép xuống dưới.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đi thẳng nối dài sang F6 thay vì bẻ xuống F5.',
              why: 'Nối dài (Nobi) tuy an toàn nhưng trong tình huống 2 đấu 2 lại quá hiền lành.'
            },
            {
              moves: [{ x: 5, y: 3, color: BLACK }],
              caption: 'Đen đánh F6, nhường hoàn toàn giao điểm chiến lược F5 cho Trắng.',
              why: 'Đen không gây được áp lực khí nào lên cặp D5-E5.'
            },
            {
              moves: [{ x: 5, y: 4, color: WHITE }],
              caption: 'Trắng lập tức bẻ đầu ngược lại tại F5! Trắng tăng khí vươn ra ngoài còn Đen bị mất tiên thủ.',
              why: 'Gặp đầu 2 quân đang ngang hàng nhau: “Ai bẻ được trước là người thắng thế!”'
            }
          ]
        }
      ]
    },

    'lesson-4-3': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: A9 điểm 1-1',
          summary: 'Đánh thẳng vào đỉnh góc 1-1 (A9) phá tan mọi khả năng tách 2 mắt của cụm Trắng.',
          steps: [
            {
              caption: 'Trắng ở góc trên trái có 3 điểm trống (A9, B9, A8). Nhìn kỹ: nếu Đen đánh sai chỗ, Trắng sẽ tách được 2 mắt.',
              why: 'Điểm 1-1 ở góc (A9) thường là yếu điểm duy nhất để phá mắt các hình góc đặc biệt.'
            },
            {
              moves: [{ x: 0, y: 0, color: BLACK }],
              caption: 'Đen đánh thẳng vào điểm 1-1 (A9)!',
              why: 'Quân A9 có tới 2 khí (B9 và A8) nên Trắng không thể tự sát để bắt ngay.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Nước sau Đen chỉ việc đánh B9 hoặc A8 để Atari, biến toàn bộ góc Trắng thành 1 mắt chết!',
              why: 'Dù Trắng có chạy theo hướng nào, A9 vẫn ngăn cản Trắng chia làm 2 mắt riêng biệt.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: B9 đánh cạnh',
          summary: 'Đánh B9 hoặc A8 bị Trắng chiếm ngay điểm 1-1 (A9) ăn quân và tách làm 2 mắt sống.',
          steps: [
            {
              caption: 'Xét trường hợp Đen ngại đánh góc 1-1 nên đánh vào B9 trước.',
              why: 'Đánh B9 tưởng là thu hẹp mắt từ bên ngoài, nhưng lại mở cơ hội phản đòn cho Trắng.'
            },
            {
              moves: [{ x: 1, y: 0, color: BLACK }],
              caption: 'Đen đánh B9 — quân B9 chỉ có 1 khí duy nhất tại A9!',
              why: 'Đây là nước tự đẩy mình vào thế 1 khí bên trong góc địch.'
            },
            {
              moves: [{ x: 0, y: 0, color: WHITE }],
              caption: 'Trắng đánh ngay vào A9 ăn quân Đen B9! Lúc này Trắng có ngay 2 mắt riêng biệt (B9 và A8? Hoặc giữ A9 sống 100%) → Trắng sống!',
              why: 'Trong Tsumego góc, điểm 1-1 (A9) luôn phải là điểm kiểm tra đầu tiên!'
            }
          ]
        }
      ]
    },

    'lesson-4-4': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: F6 Miệng Hổ',
          summary: 'Tạo hình Miệng Hổ tại F6 — giữ liên kết đẹp và bắt gọn quân Trắng nếu Trắng dám cắt E6.',
          steps: [
            {
              caption: 'Đen có hai quân đứng chéo D6 và E5, bị Trắng C6, D5, F5 ép sát xung quanh.',
              why: 'Đen cần nối D6 và E5 nhưng không muốn tạo hình Tam Giác Rỗng nặng nề ở E6.'
            },
            {
              moves: [{ x: 5, y: 3, color: BLACK }],
              caption: 'Đen đánh F6 tạo hình Miệng Hổ (Kake-tsugi) hướng vào E6!',
              why: 'F6 vừa mở rộng không gian sang phải, vừa biến giao điểm cắt E6 thành cái bẫy chỉ còn 1 khí.'
            },
            {
              moves: [{ x: 4, y: 3, color: WHITE }, { x: 4, y: 2, color: BLACK }],
              caption: 'Nếu Trắng liều lĩnh cắt vào E6, Trắng chỉ còn 1 khí ở E7 và bị Đen đớp gọn ngay lập tức!',
              why: 'Miệng Hổ là hình cờ kinh điển vừa công vừa thủ trong cờ vây.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: E6 Tam Giác Rỗng',
          summary: 'Nối thẳng E6 tạo thành Tam Giác Rỗng chật chội, để Trắng ép đầu E7.',
          steps: [
            {
              caption: 'Xét trường hợp Đen nối thẳng vào E6 cho “chắc ăn”.',
              why: 'E6 nối được D6 và E5 nhưng hình thành cụm 3 quân Tam Giác Rỗng (D6-E6-E5).'
            },
            {
              moves: [{ x: 4, y: 3, color: BLACK }],
              caption: 'Đen đánh E6 — hình cờ co cụm và mất toàn bộ sức bật lên phía trên.',
              why: 'Số khí và tầm ảnh hưởng của cụm Đen bị thu hẹp đáng kể.'
            },
            {
              moves: [{ x: 4, y: 2, color: WHITE }],
              caption: 'Trắng ép ngay xuống E7 (bẻ đầu quân Đen)! Đen bị kìm hãm hoàn toàn ở phía trên.',
              why: 'Dùng Miệng Hổ F6 giúp Đen tránh được đòn ép E7 và bảo vệ điểm cắt cực kỳ thanh thoát.'
            }
          ]
        }
      ]
    },

    'lesson-5-1': {
      variations: [
        {
          id: 'demo',
          kind: 'good',
          label: 'Minh họa: 4 Góc trước',
          summary: 'Quy trình khai cuộc chuẩn 19×19: chiếm hết 4 góc trước khi tiến ra biên.',
          initialPosition: { black: [], white: [] },
          steps: [
            {
              caption: 'Bàn cờ 19×19 có 9 Điểm Sao (Hoshi). 4 Điểm Sao góc (4-4) là vị trí khai cuộc cân bằng nhất.',
              why: 'Ở góc có sẵn 2 cạnh bàn cờ làm tường bao, nên dùng ít quân nhất để vây được nhiều đất nhất.'
            },
            {
              moves: [
                { x: 15, y: 3, color: BLACK },
                { x: 3, y: 3, color: WHITE },
                { x: 15, y: 15, color: BLACK },
                { x: 3, y: 15, color: WHITE }
              ],
              caption: 'Hai bên lần lượt chiếm hết 4 góc trước tiên!',
              why: '“Góc là vàng, biên là bạc, giữa bàn là cỏ dại” trong giai đoạn đầu ván.'
            },
            {
              moves: [{ x: 13, y: 2, color: BLACK }],
              caption: 'Khi 4 góc đã có chủ, bắt đầu Tiếp Cận Góc (Kakari) như O17.',
              why: 'Tiếp cận góc vừa thăm dò góc đối thủ vừa phát triển biên trên.'
            }
          ]
        },
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: Q4 chiếm góc trống',
          summary: 'Chiếm điểm Sao Q4 ở góc dưới phải còn bỏ trống — nước khai cuộc giá trị nhất bàn cờ.',
          initialPosition: { black: [[15, 3]], white: [[3, 3], [3, 15]] },
          steps: [
            {
              caption: 'Trên bàn 19×19 mới đánh 3 nước: Trắng giữ 2 góc trái, Đen giữ góc trên phải, góc dưới phải vẫn trống!',
              why: 'Khi vẫn còn một góc hoàn toàn trống trên bàn cờ, chiếm góc trống luôn là ưu tiên số 1.'
            },
            {
              moves: [{ x: 15, y: 15, color: BLACK }],
              caption: 'Đen chiếm ngay Điểm Sao Q4 (4-4) ở góc dưới phải!',
              why: 'Q4 (hoặc R4/Q3) bảo đảm chia đều 4 góc (2–2) và chuẩn bị phối hợp dọc biên phải với Q16.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: K10 giữa bàn',
          summary: 'Đi vào tâm Thiên Nguyên K10 quá sớm bỏ lỡ góc lớn Q4 cho Trắng chiếm mất.',
          initialPosition: { black: [[15, 3]], white: [[3, 3], [3, 15]] },
          steps: [
            {
              caption: 'Xét trường hợp Đen đi ngay vào chính giữa Thiên Nguyên K10 ở nước thứ 4.',
              why: 'Người mới rất thích đặt quân ở chính giữa bàn cờ vì nhìn “oai”, nhưng thực tế hiệu suất vây đất rất thấp.'
            },
            {
              moves: [{ x: 9, y: 9, color: BLACK }],
              caption: 'Đen đánh K10 — xung quanh trống trải 4 phía, không vây được điểm đất chắc chắn nào.',
              why: 'Một quân ở giữa bàn cần tới 8–10 quân nữa mới tạo thành khung đất, trong khi ở góc chỉ cần 2–3 quân.'
            },
            {
              moves: [{ x: 15, y: 15, color: WHITE }],
              caption: 'Trắng lập tức chiếm góc trống thứ 3 tại Q4! Trắng sở hữu tới 3/4 góc trên bàn cờ và dẫn trước ngay từ khai cuộc.',
              why: 'Trong khai cuộc chuẩn, hãy luôn chiếm góc trống trước khi nghĩ tới trung tâm.'
            }
          ]
        }
      ]
    },

    'lesson-5-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: Chặn Q17 xây tường',
          summary: 'Hoàn tất Định thức Tam Tam (Q17 → Q15 → Q14 → P16) lấy bức tường ngoài cực dày.',
          steps: [
            {
              caption: 'Đen đang giữ Điểm Sao Q16 (4-4), Trắng xâm nhập ngay điểm Tam Tam R17 (3-3).',
              why: 'Định thức 3-3 trao đổi công bằng: Trắng lấy đất góc (~10 điểm), Đen lấy tường dày hướng ra ngoài.'
            },
            {
              moves: [{ x: 15, y: 2, color: BLACK }, { x: 16, y: 3, color: WHITE }],
              caption: 'Đen chặn phía trên ở Q17 (bảo vệ biên trên), Trắng bò xuống R16.',
              why: 'Chặn hướng nào thì bạn sẽ xây bức tường hướng về phía ngược lại (ở đây hướng sang trái).'
            },
            {
              moves: [{ x: 15, y: 4, color: BLACK }, { x: 16, y: 4, color: WHITE }, { x: 15, y: 5, color: BLACK }],
              caption: 'Đen nối dài Q15 → Trắng R15 → Đen Q14 (lấy bức tường 4 quân đứng thẳng vững chắc).',
              why: 'Luôn kéo tường đủ dài trước khi quay lại khóa đầu góc.'
            },
            {
              moves: [{ x: 14, y: 2, color: WHITE }, { x: 14, y: 3, color: BLACK }],
              caption: 'Trắng bẻ góc P17 để làm 2 mắt sống; Đen nối chắc P16 hoàn tất bức tường!',
              why: 'Kết quả hoàn toàn cân bằng: Trắng sống nhỏ ở góc, Đen có thế lực khổng lồ khống chế cả biên trên lẫn trung tâm.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: R16 chặn sai nhịp',
          summary: 'Nếu Đen vội bỏ qua Q15 hoặc nối sai, Trắng bẻ ra ngoài và phá vỡ bức tường Đen.',
          steps: [
            {
              caption: 'Xét sai lầm phổ biến: sau khi Đen chặn Q17 và Trắng đi R16, Đen quên kéo dài tường xuống Q15 mà đi R15 chặn đầu.',
              why: 'Chặn đầu R15 ngay trước mặt R16 sẽ hở điểm cắt giữa Q16 và Q17!'
            },
            {
              moves: [{ x: 15, y: 2, color: BLACK }, { x: 16, y: 3, color: WHITE }],
              caption: 'Đen chặn Q17, Trắng nối xuống R16.',
              why: 'Đến đây nước chuẩn bắt buộc là kéo dài xuống Q15.'
            },
            {
              moves: [{ x: 16, y: 4, color: BLACK }, { x: 15, y: 4, color: WHITE }],
              caption: 'Nếu Đen bẻ ngay R15, Trắng lập tức cắt vào Q15! Bức tường Đen bị chẻ làm đôi và Q16-Q17 rơi vào nguy hiểm.',
              why: 'Vì vậy trong Định thức 3-3, phải nối dài Q15 → Q14 trước khi nghĩ đến việc bẻ đầu.'
            }
          ]
        }
      ]
    },

    'lesson-5-3': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: R14 đỡ Mã bình tĩnh',
          summary: 'Đỡ góc bằng nước Mã (Keima) tại R14 để giữ chắc đất góc và cân bằng hai bên.',
          steps: [
            {
              caption: 'Trắng tiếp cận góc Sao Q16 của Đen bằng nước Mã O17 (Kakari).',
              why: 'Khi biên trên chưa có quân hỗ trợ (khác với bài 5.6), nước đỡ góc bình tĩnh là lựa chọn chuẩn xác nhất.'
            },
            {
              moves: [{ x: 16, y: 5, color: BLACK }],
              caption: 'Đen đỡ góc nhẹ nhàng bằng nước Mã R14 (Keima)!',
              why: 'R14 bảo vệ vùng đất bên cạnh phải của góc Sao và giữ nhịp khai cuộc mượt mà.'
            },
            {
              moves: [{ x: 11, y: 2, color: WHITE }],
              caption: 'Trắng mở rộng 2 ô sang trái tại M17 để tạo căn cứ sống — kết thúc Định thức hòa bình!',
              why: 'Hai bên chia đều lợi ích: Đen giữ đất góc phải, Trắng ổn định căn cứ biên trên.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: P17 chạm sát quá vội',
          summary: 'Đánh chạm P17 ngay giữa Q16 và O17 dễ bị Trắng bẻ phản công làm góc Đen bị rối.',
          steps: [
            {
              caption: 'Xét trường hợp Đen đánh chạm trực tiếp vào P17 thay vì đỡ nhẹ ở R14.',
              why: 'Đánh chạm P17 kích hoạt giao chiến phức tạp và giúp Trắng có thế dựa vào biên trên.'
            },
            {
              moves: [{ x: 14, y: 2, color: BLACK }],
              caption: 'Đen đánh P17 — mời gọi Trắng cắt hoặc bẻ đầu.',
              why: 'Khi chưa có quân hỗ trợ xung quanh, chủ động gây chiến sớm thường có lợi cho bên có căn cứ.'
            },
            {
              moves: [{ x: 14, y: 3, color: WHITE }],
              caption: 'Trắng phản đòn cắt hoặc đẩy P16! Thế trận trở nên hỗn loạn và Đen mất quyền giữ góc êm ái.',
              why: 'Nước đỡ Keima R14 (hoặc nhảy Q14) luôn đơn giản, chắc chắn và đạt hiệu suất cao nhất.'
            }
          ]
        }
      ]
    },

    'lesson-6-1': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: P10 Đánh Vai Xâm Lấn',
          summary: 'Đánh Vai trên đường 5 (P10) để xóa khung đất Moyo của Trắng một cách an toàn tuyệt đối.',
          steps: [
            {
              caption: 'Trắng đang dựng một Khung Đất (Moyo) khổng lồ dọc toàn bộ biên phải (Q16 – Q10 – Q4) có tường hỗ trợ.',
              why: 'Vì quân Trắng quá dày ở đường 4, nếu nhảy sâu vào đường 2–3 sẽ bị vây chết.'
            },
            {
              moves: [{ x: 14, y: 9, color: BLACK }],
              caption: 'Đen dùng đòn Đánh Vai (Katatsuki) tại P10 (đường 5, chéo sát Q10)!',
              why: 'P10 xóa tan tham vọng biến trung tâm thành đất của Trắng, giữ Đen hoàn toàn an toàn và hướng thẳng ra giữa bàn.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: R13 Đả Nhập quá sâu',
          summary: 'Nhảy sâu xuống đường 3 (R13) giữa 2 quân Trắng mạnh bị chụp mũ P13 và rơi vào thế chết.',
          steps: [
            {
              caption: 'Xét sai lầm phổ biến: thấy đất Trắng to quá liền nhảy sâu vào đường 3 tại R13.',
              why: 'R13 nằm giữa Q16 và Q10 — cả hai đều là quân Trắng đứng sẵn rất vững!'
            },
            {
              moves: [{ x: 16, y: 6, color: BLACK }],
              caption: 'Đen đánh R13 ở đường 3 — hoàn toàn đơn độc dưới hỏa lực hai bên của Trắng.',
              why: 'R13 vừa thiếu không gian làm 2 mắt, vừa bị chặn cả đường chạy ra trung tâm.'
            },
            {
              moves: [{ x: 14, y: 6, color: WHITE }],
              caption: 'Trắng chụp mũ nhẹ nhàng tại P13! Quân Đen R13 bị nhốt kín trong lồng, chạy cũng không được mà sống cũng rất khó.',
              why: 'Nhớ nguyên tắc vàng: đối thủ quá dày → Xâm Lấn từ đường 5 (P10), đừng Đả Nhập sâu!'
            }
          ]
        }
      ]
    },

    'lesson-6-2': {
      variations: [
        {
          id: 'good',
          kind: 'good',
          label: 'Tốt: D9 Hầu Khiêu Thu Quan',
          summary: 'Tung đòn Hầu Khiêu hình Mã xuống đường 1 tại D9, ép Trắng C8 rồi nối về E8 ăn sâu đất biên.',
          initialPosition: {
            black: [[5, 1], [6, 1], [6, 2], [6, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]],
            white: [[1, 1], [1, 2], [2, 2], [3, 2], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]]
          },
          steps: [
            {
              caption: 'Ở giai đoạn Thu Quan, Đen đã có quân F8 chống lưng ở đường 2. Vùng biên trên bên trái Trắng đang mở.',
              why: 'Nếu có đồng đội ở đường 2, bạn có thể dùng nước nhảy Mã xuống đường 1 gọi là Hầu Khiêu (Monkey Jump)!'
            },
            {
              moves: [{ x: 3, y: 0, color: BLACK }],
              caption: 'Đen nhảy Hầu Khiêu xuống đường 1 tại D9!',
              why: 'D9 đe dọa luồn sâu vào tận C9-B9 phá sạch đất góc Trắng, buộc Trắng phải chặn lại.'
            },
            {
              moves: [{ x: 2, y: 1, color: WHITE }, { x: 4, y: 1, color: BLACK }],
              caption: 'Trắng chặn C8; Đen nối chắc tại E8! Đen gặm sâu được vào cột D–E một cách hoàn toàn an toàn.',
              why: 'Hầu Khiêu lời hơn nhiều điểm so với việc chỉ đẩy thẳng E8.'
            }
          ]
        },
        {
          id: 'bad',
          kind: 'bad',
          label: 'Chưa tốt: E8 đẩy quá hiền',
          summary: 'Đẩy E8 không tạo áp lực sâu — Trắng chặn D8 và giữ vững toàn bộ đất góc trên trái.',
          initialPosition: {
            black: [[5, 1], [6, 1], [6, 2], [6, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]],
            white: [[1, 1], [1, 2], [2, 2], [3, 2], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]]
          },
          steps: [
            {
              caption: 'Xét trường hợp Đen chỉ đẩy từng ô một tại E8.',
              why: 'Đẩy đường 2 không gây được đe dọa luồn dưới đường 1.'
            },
            {
              moves: [{ x: 4, y: 1, color: BLACK }],
              caption: 'Đen đánh E8 — Trắng chỉ cần chặn ngay đầu E8 là xong.',
              why: 'Trắng giữ nguyên được cả vùng đất cột D và đường 1.'
            },
            {
              moves: [{ x: 3, y: 1, color: WHITE }],
              caption: 'Trắng chặn D8! Trắng bảo toàn trọn vẹn vùng đất biên trên bên trái, Đen mất sạch lợi thế Hầu Khiêu.',
              why: 'Khi có quân đường 2 chống lưng và đường 1 mở rộng, hãy luôn nhớ đến đòn Hầu Khiêu!'
            }
          ]
        }
      ]
    }
  };

  const EXTRA_GLOSSARY = [
    {
      term: 'Tổ Hạc (Crane’s Nest)',
      jp: 'Tsuru no Sugomori',
      category: 'Chiến thuật',
      lessonId: 'lesson-2-7',
      desc: 'Đòn khóa lối thoát từ xa trước khi bắt 2 quân địch nằm giữa vòng vây, khiến địch chạy sườn nào cũng chết.'
    },
    {
      term: 'Bí Khí (Damezumari)',
      jp: 'Damezumari',
      category: 'Chiến thuật',
      lessonId: 'lesson-2-8',
      desc: 'Tình trạng các nhóm quân tự làm nghẽn khí của nhau khiến một nước nối bình thường bỗng trở thành tự sát hoặc còn 1 khí.'
    },
    {
      term: 'Tứ Khúc Góc (Bent Four)',
      jp: 'Magari-shimoku',
      category: 'Sống & Chết',
      lessonId: 'lesson-3-6',
      desc: 'Hình 4 ô chữ L ở góc bàn cờ; cần chiếm đúng điểm gãy 1-2 để tách thành 2 mắt sống.'
    },
    {
      term: 'Lục Hoa Mai (Rabbitty Six)',
      jp: 'Hana-rokumoku',
      category: 'Sống & Chết',
      lessonId: 'lesson-3-7',
      desc: 'Không gian 6 ô hình hoa mai; có đúng 1 điểm Nakade duy nhất ở nhụy hoa giữa để giết địch.'
    },
    {
      term: 'Đan Chéo / Nêm (Wedge)',
      jp: 'Warikomi',
      category: 'Hình cờ',
      lessonId: 'lesson-4-5',
      desc: 'Nêm thẳng vào giữa khe 1 ô của đối phương để chia cắt hoặc tạo đòn Song Chiếu.'
    },
    {
      term: 'Xuyên Gầm (Underneath)',
      jp: 'Watari',
      category: 'Hình cờ',
      lessonId: 'lesson-4-6',
      desc: 'Nước luồn dưới đường 1 ngay bên dưới quân địch để nối liền hai cánh quân ở hai bên.'
    },
    {
      term: 'Chụp Mũ (Cap)',
      jp: 'Boshi',
      category: 'Hình cờ',
      lessonId: 'lesson-4-7',
      desc: 'Đặt quân cách 1 ô phía trên đầu quân yếu của địch hướng trung tâm để kìm hãm mà không tạo chỗ dựa cho địch.'
    },
    {
      term: 'Đóng Góc (Shimari)',
      jp: 'Shimari',
      category: 'Khai cuộc & Thu quan',
      lessonId: 'lesson-5-4',
      desc: 'Nước thứ hai bổ sung cho quân góc (thường là Tiểu Mục 3-4) nhằm khóa chặt đất góc và hướng ảnh hưởng ra biên.'
    },
    {
      term: 'Kẹp Tấn Công (Pincer)',
      jp: 'Hasami',
      category: 'Khai cuộc & Thu quan',
      lessonId: 'lesson-5-6',
      desc: 'Đánh kẹp vào quân tiếp cận góc của địch khi đã có sẵn đồng đội hỗ trợ ở biên.'
    },
    {
      term: 'Xử Lý Nhẹ (Sabaki)',
      jp: 'Sabaki',
      category: 'Khai cuộc & Thu quan',
      lessonId: 'lesson-6-3',
      desc: 'Nghệ thuật xử lý nhóm quân mỏng trong lòng địch một cách linh hoạt, mượn lực bằng nước chạm để tạo hình sống hoặc thí quân.'
    }
  ];

  function parseCodeTuple(code) {
    const parts = String(code || '0.0').split('.').map((n) => parseInt(n, 10) || 0);
    return [parts[0] || 0, parts[1] || 0];
  }

  function applyPuzzleLibrary(academy) {
    if (!academy || !Array.isArray(academy.LESSONS)) return academy;

    const existingIds = new Set(academy.LESSONS.map((l) => l.id));
    for (const extra of EXTRA_LESSONS) {
      if (!existingIds.has(extra.id)) {
        academy.LESSONS.push(extra);
        existingIds.add(extra.id);
      }
    }

    academy.LESSONS.sort((a, b) => {
      const [sa, la] = parseCodeTuple(a.code);
      const [sb, lb] = parseCodeTuple(b.code);
      if (sa !== sb) return sa - sb;
      return la - lb;
    });

    for (const lesson of academy.LESSONS) {
      const analysis = EXISTING_LESSON_ANALYSES[lesson.id];
      if (analysis && Array.isArray(analysis.variations)) {
        lesson.variations = analysis.variations;
      }
      // Keep demoSteps synced with first variation for backward compatibility
      if (Array.isArray(lesson.variations) && lesson.variations.length > 0 && (!lesson.demoSteps || lesson.demoSteps.length === 0)) {
        lesson.demoSteps = lesson.variations[0].steps;
      }
    }

    if (Array.isArray(academy.GLOSSARY)) {
      const existingTerms = new Set(academy.GLOSSARY.map((g) => g.term));
      for (const item of EXTRA_GLOSSARY) {
        if (!existingTerms.has(item.term)) {
          academy.GLOSSARY.push(item);
          existingTerms.add(item.term);
        }
      }
    }

    return academy;
  }

  const exportsObj = {
    EXTRA_LESSONS,
    EXISTING_LESSON_ANALYSES,
    EXTRA_GLOSSARY,
    applyPuzzleLibrary
  };

  root.GoAcademy = root.GoAcademy || {};
  Object.assign(root.GoAcademy, exportsObj);

  if (root.GoAcademy && Array.isArray(root.GoAcademy.LESSONS)) {
    applyPuzzleLibrary(root.GoAcademy);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  }
})(typeof window !== 'undefined' ? window : globalThis);
