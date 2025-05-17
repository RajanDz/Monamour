package com.monamour.monamour.repository;

import com.monamour.monamour.entities.PaymentsMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentsMethodRepo extends JpaRepository<PaymentsMethod, Long> {

    Optional<PaymentsMethod> findById(Integer id);

    List<PaymentsMethod> findByUserId(Integer id);

    PaymentsMethod deleteByUserId(int userId);

    PaymentsMethod deleteByIdAndUserId(int cardId, int userId);

    Optional<PaymentsMethod> findByIdAndUserId(int cardId, int userId);
}
