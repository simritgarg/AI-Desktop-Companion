package com.companion.controller;

import com.companion.entity.VisionBoardEntity;
import com.companion.entity.VisionBoardItemEntity;
import com.companion.repository.VisionBoardItemRepository;
import com.companion.repository.VisionBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vision-boards")
@CrossOrigin(origins = "*")
public class VisionBoardController {

    @Autowired
    private VisionBoardRepository visionBoardRepository;

    @Autowired
    private VisionBoardItemRepository visionBoardItemRepository;

    @GetMapping
    public ResponseEntity<List<VisionBoardEntity>> getBoards() {
        return ResponseEntity.ok(visionBoardRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<VisionBoardEntity> createBoard(@RequestBody VisionBoardEntity board) {
        return ResponseEntity.ok(visionBoardRepository.save(board));
    }

    @GetMapping("/{boardId}/items")
    public ResponseEntity<List<VisionBoardItemEntity>> getBoardItems(@PathVariable Long boardId) {
        return ResponseEntity.ok(visionBoardItemRepository.findByBoardIdOrderByDisplayOrderAsc(boardId));
    }

    @PostMapping("/{boardId}/items")
    public ResponseEntity<VisionBoardItemEntity> addItem(@PathVariable Long boardId, @RequestBody VisionBoardItemEntity item) {
        item.setBoardId(boardId);
        return ResponseEntity.ok(visionBoardItemRepository.save(item));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        if (visionBoardItemRepository.existsById(itemId)) {
            visionBoardItemRepository.deleteById(itemId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
