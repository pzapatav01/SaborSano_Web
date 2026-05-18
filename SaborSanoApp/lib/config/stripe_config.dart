/// Clave publicable de Stripe (modo test).
/// Cópiala desde Stripe Dashboard → Developers → API keys.
class StripeConfig {
  StripeConfig._();

  static const String publishableKey = String.fromEnvironment(
    'STRIPE_PUBLISHABLE_KEY',
    defaultValue: 'pk_test_51TTknxRplzRD7wIAgCd4lEYasd8NNp5m65F9BPyAjfDIa1nG5L31PoYBvfu1adlS3en1X9kjeIi8FuyZYJJlyKk000Ubd7aQk4',
  );
}
