package com.companion.controller;

import com.companion.entity.CategoryEntity;
import com.companion.repository.CategoryRepository;
import com.companion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryEntity>> getCategories() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<CategoryEntity> userCategories = categoryRepository.findByUserIdAndIsDeletedFalse(userId);

        // Pre-populate default categories for new user if empty
        if (userCategories.isEmpty()) {
            List<CategoryEntity> defaults = Arrays.asList(
                CategoryEntity.builder().userId(userId).name("IT & Dev").color("#3B82F6").icon("code").build(),
                CategoryEntity.builder().userId(userId).name("SSC CGL").color("#EAB308").icon("book").build(),
                CategoryEntity.builder().userId(userId).name("General").color("#8B5CF6").icon("folder").build(),
                CategoryEntity.builder().userId(userId).name("Personal").color("#EC4899").icon("user").build(),
                CategoryEntity.builder().userId(userId).name("Fitness & Health").color("#10B981").icon("heart").build()
            );
            userCategories = categoryRepository.saveAll(defaults);
        }

        return ResponseEntity.ok(userCategories);
    }

    @PostMapping
    public ResponseEntity<CategoryEntity> createCategory(@RequestBody CategoryEntity category) {
        Long userId = SecurityUtils.getCurrentUserId();
        category.setUserId(userId);
        if (category.getIsDeleted() == null) category.setIsDeleted(false);
        if (category.getColor() == null) category.setColor("#8B5CF6");
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryEntity> updateCategory(@PathVariable Long id, @RequestBody CategoryEntity details) {
        Long userId = SecurityUtils.getCurrentUserId();
        return categoryRepository.findById(id)
                .filter(c -> c.getUserId().equals(userId))
                .map(cat -> {
                    if (details.getName() != null) cat.setName(details.getName());
                    if (details.getColor() != null) cat.setColor(details.getColor());
                    if (details.getIcon() != null) cat.setIcon(details.getIcon());
                    return ResponseEntity.ok(categoryRepository.save(cat));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return categoryRepository.findById(id)
                .filter(c -> c.getUserId().equals(userId))
                .map(cat -> {
                    cat.setIsDeleted(true);
                    categoryRepository.save(cat);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
